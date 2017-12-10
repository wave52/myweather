# -*- coding: utf-8 -*-

import scrapy
import json
from myweather.items import OneDayItem
import urllib2
import re
import time

def loads_jsonp(_jsonp):
    try:
        return json.loads(re.match(".*?({.*}).*",_jsonp,re.S).group(1),encoding='utf-8')
    except:
        raise ValueError('Invalid Input')

class OneDaySpider(scrapy.Spider):
    name='od'
    allowed_domains = ["http://d1.weather.com.cn/aqi_all"]

    # start_urls = [
    #     # 'http://d1.weather.com.cn/aqi_all/101270101.html?_=1493617666589'
    #     # 'http://d1.weather.com.cn/sk_2d/101290101.html?_=1493618850306'
    #     # "http://www.weather.com.cn/air/?city=101270101"
    #     # "http://www.weather.com.cn/weather1d/101270101.shtml",
    #     # "http://www.weather.com.cn/weather/101270101.shtml"
    # ]

    def start_requests(self):
        # 13位毫秒数
        millis = int(round(time.time() * 1000))
        # 打开city_code 101272004 101270101
        f = open("city_code.json")
        city = json.load(f)
        contents = city["contents"]
        reqs=[]
        for index in range(len(contents)):
            code = contents[index]["id"]
            url='http://d1.weather.com.cn/aqi_all/%s.html?_=%s'%(code,millis)
            req=scrapy.Request(url,headers={'Referer':'http://www.weather.com.cn/air/?city=%s'%code})
            # url='http://d1.weather.com.cn/aqi_all/101270101.html?_=%s'%millis
            # req=scrapy.Request(url,headers={'Referer':'http://www.weather.com.cn/air/?city=101270101'})
            reqs.append(req)
        return reqs

    def parse(self, response):
        oneDayItem = OneDayItem()
        if 'weather_error_404.html' in response.url:
            oneDayItem['city_id'] = response.url[-14:-5]
            oneDayItem['city_json'] = ''
        else:
            oneDayItem['city_id'] = response.url[33:42]
            body = response.body_as_unicode()
            oneDayItem['city_json'] = json.dumps(loads_jsonp(body)) #<type 'str'>
        yield oneDayItem