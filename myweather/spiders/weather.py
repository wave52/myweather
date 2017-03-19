# -*- coding: utf-8 -*-
import scrapy

from tutorial.items import DmozItem

class DmozSpider(scrapy.Spider):
    name = "dmoz"
    allowed_domains = ["dmoz.org"]
    start_urls = [
        "http://www.weather.com.cn/weather/101270101.shtml",
        "http://www.weather.com.cn/weather/101010100.shtml"
    ]

    def parse(self, response):
        for sel in response.xpath('//ul[contains(@class,"t clearfix")]/li'):
            item = DmozItem()
            item['time'] = sel.xpath('h1/text()').extract()
            item['temp'] = sel.xpath('p[contains(@class,"tem")]/i/text()').extract()
            yield item