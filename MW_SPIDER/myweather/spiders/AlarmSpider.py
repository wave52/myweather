# -*- coding: utf-8 -*-

import scrapy
import json
from myweather.items import AlarmItem
import urllib2
import re
import time

def loads_jsonp(_jsonp):
    try:
        return json.loads(re.match(".*?({.*}).*",_jsonp,re.S).group(1),encoding='utf-8')
    except:
        raise ValueError('Invalid Input')

class AirSpider(scrapy.Spider):
    name='alarm'
    allowed_domains = ["http://product.weather.com.cn/alarm/webdata/"]

    # start_urls = [
    #     # http://www.weather.com.cn/data/alarminfo/0204.html?_=1495480429351
    #     # http://product.weather.com.cn/alarm/webdata/1011202-20170522073800-1202.html?_=1495471100383
    #     # http://product.weather.com.cn/alarm/grepalarm.php?areaid=[\d]{5,7}&type=[\d]{2}&level=[\d]{2}&_=1495473710730
    # ]

    def start_requests(self):
        # 13位毫秒数
        millis = int(round(time.time() * 1000))
        # 打开city_code 101272004 101270101
        firsturl="http://product.weather.com.cn/alarm/grepalarm.php?areaid=[\d]{5,7}&type=[\d]{2}&level=[\d]{2}&_=%s"%(millis)
        firstreq=urllib2.Request(firsturl)
        firstreq.add_header("Referer", "http://www.weather.com.cn/alarm/warninglist.shtml")
        contents = loads_jsonp(urllib2.urlopen(firstreq).read())['data']
        reqs=[]
        for index in range(len(contents)):
            code = contents[index][1]
            url='http://product.weather.com.cn/alarm/webdata/%s?_=%s'%(code,millis)
            req=scrapy.Request(url,headers={'Referer':'http://www.weather.com.cn/alarm/newalarmcontent.shtml?file=%s'%code})
            # url='http://d1.weather.com.cn/aqi_all/101270101.html?_=%s'%millis
            # req=scrapy.Request(url,headers={'Referer':'http://www.weather.com.cn/air/?city=101270101'})
            reqs.append(req)
        return reqs

    def parse(self, response):
        alarmItem = AlarmItem()
        body = response.body_as_unicode()
        effects = loads_jsonp(body)['EFFECT'].split(',')
        for effect in effects:
            alarmItem['city_id'] = effect
            alarmItem['city_json'] = json.dumps(loads_jsonp(body))
        yield alarmItem