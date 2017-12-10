# -*- coding: utf-8 -*-

import scrapy
import json
from myweather.items import BaseInfoItem,WindItem
import urllib2
import re
import time


def loads_jsonp(_jsonp):
    try:
        return json.loads(re.match(".*?({.*}).*",_jsonp,re.S).group(1),encoding='utf-8')
    except:
        raise ValueError('Invalid Input')


class BaseSpider(scrapy.Spider):
    name='bs'
    allowed_domains = ["http://d1.weather.com.cn/sk_2d/"]

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
            url='http://d1.weather.com.cn/sk_2d/%s.html?_=%s'%(code,millis)
            req=scrapy.Request(url,headers={'Referer':'http://www.weather.com.cn/weather1d/%s.shtml'%code})
            # url='http://d1.weather.com.cn/sk_2d/101270101.html?_=%s'%millis
            # req=scrapy.Request(url,headers={'Referer':'http://www.weather.com.cn/weather1d/101270101.shtml'})
            reqs.append(req)
        return reqs

    def parse(self, response):
        baseInfoItem = BaseInfoItem()
        windItem = WindItem()
        body = response.body_as_unicode()
        baseInfoItem['city_id'] = loads_jsonp(body)['city']
        baseInfoItem['now_temp'] = loads_jsonp(body)['temp']
        baseInfoItem['humidity'] = loads_jsonp(body)['SD'][0:-1]
        baseInfoItem['rain'] = loads_jsonp(body)['rain']
        windItem['city_id'] = loads_jsonp(body)['city']
        windItem['wind_power'] = loads_jsonp(body)['WS']
        windItem['wind_direction'] = loads_jsonp(body)['WD']
        yield baseInfoItem
        yield windItem
