# -*- coding: utf-8 -*-

import scrapy
import json
from myweather.items import AirItem
import urllib2
import re
import time


def loads_jsonp(_jsonp):
    try:
        return json.loads(re.match(".*?({.*}).*",_jsonp,re.S).group(1),encoding='utf-8')
    except:
        raise ValueError('Invalid Input')


class AirSpider(scrapy.Spider):
    name='air'
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
        airItem = AirItem()
        if 'weather_error_404.html' in response.url:
            airItem['city_id'] = response.url[-14:-5]
            airItem['aqi'] = ''
            airItem['pm2_5'] = ''
            airItem['pm10'] = ''
            airItem['co'] = ''
            airItem['no2'] = ''
        else:
            airItem['city_id'] = response.url[33:42]
            body = response.body_as_unicode()
            airItem['aqi'] = loads_jsonp(body)["data"][23]["t1"]
            airItem['pm2_5'] = loads_jsonp(body)["data"][23]["t3"]
            airItem['pm10'] = loads_jsonp(body)["data"][23]["t4"]
            airItem['co'] = loads_jsonp(body)["data"][23]["t6"]
            airItem['no2'] = loads_jsonp(body)["data"][23]["t9"]
        yield airItem