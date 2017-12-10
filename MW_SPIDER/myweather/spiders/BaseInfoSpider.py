# -*- coding: utf-8 -*-

import scrapy
import json
from myweather.items import CityItem,BaseInfoItem,WindItem

class BaseInfoSpider(scrapy.Spider):
    name = "bi"
    allowed_domains = ["http://www.weather.com.cn/weather/"]

    # start_urls = [
    #     "http://www.weather.com.cn/weather1d/101270101.shtml",
    #     "http://www.weather.com.cn/weather/101010200.shtml"
    # ]

    def start_requests(self):
        f = open("city_code.json")
        city = json.load(f)
        contents = city["contents"]
        reqs=[]
        for index in range(len(contents)):
            code = contents[index]["id"]
            url='http://www.weather.com.cn/weather/%s.shtml'%code
            # url='http://www.weather.com.cn/weather/101270101.shtml'
            req=scrapy.Request(url)
            reqs.append(req)
        return reqs

    def parse(self, response):
        cityItem = CityItem()
        baseItem = BaseInfoItem()
        windItem = WindItem()

        f = open("city_code.json")
        city = json.load(f)
        contents = city["contents"]

        city_id = response.url[-15:-6]
        cityItem['city_id'] = city_id
        for index in range(len(contents)):
            if cityItem["city_id"] == contents[index]["id"]:
                cityItem["city_name"] = contents[index]["city"]
        count = 1
        for sel in response.xpath('//ul[contains(@class,"t clearfix")]/li'):
            baseItem['city_id'] = city_id
            baseItem['date_id'] = count
            if count==1:
                baseItem['max_temp'] = ''
            else:
                baseItem['max_temp'] = sel.xpath('p[contains(@class,"tem")]/span/text()').extract()[0]
            baseItem['min_temp'] = sel.xpath('p[contains(@class,"tem")]/i/text()').extract()[0]
            baseItem['base_describe'] = sel.xpath('p[contains(@class,"wea")]/text()').extract()[0]
            windItem['city_id'] = city_id
            windItem['date_id'] = count
            windItem['wind_describe'] = sel.xpath('p[contains(@class,"win")]/i/text()').extract()[0]
            windItem['wind_direction'] = sel.xpath('p[contains(@class,"win")]/em/span/@title').extract()[0]
            yield baseItem
            yield windItem
            count = count+1
        yield cityItem