# -*- coding: utf-8 -*-

import scrapy
import json
from myweather.items import TideItem
import time

class TideSpider(scrapy.Spider):
    name = "tide"
    allowed_domains = ["http://app.cnss.com.cn/tide_search_data.php"]

    # start_urls = [
    #     "http://www.weather.com.cn/weather1d/101270101.shtml",
    #     "http://www.weather.com.cn/weather/101010200.shtml"
    # ]

    def start_requests(self):
        f = open("port.json")
        city = json.load(f)
        contents = city["ports"]
        reqs=[]
        ltime = time.localtime()
        for index in range(len(contents)):
            code = contents[index]["id"]
            url='http://app.cnss.com.cn/tide_search_data.php?key=000000&port_id=%s&month=%s&day=%s'%(code,ltime[1],ltime[2])
            # url='http://app.cnss.com.cn/tide_search_data.php?key=000000&port_id=1&month=%s&day=%s'%(ltime[1],ltime[2])
            req=scrapy.Request(url)
            reqs.append(req)
        return reqs

    def parse(self, response):
        tideItem = TideItem()

        f = open("port.json")
        city = json.load(f)
        contents = city["ports"]

        p0 = response.url.find('&month=')
        tideItem['port_id'] = response.url[63:p0]
        for index in range(len(contents)):
            if tideItem['port_id'] == contents[index]["id"]:
                tideItem['name'] = contents[index]["port"]

        body = response.body_as_unicode()
        p1 = body.find('&values=')
        p2 = body.find('&x_labels=')
        p3 = body.find('&y_min=')
        tideLevelList = body[(p1+8):(p2-3)].split(',')
        tideTimeList = body[(p2+10):(p3-3)].split(',')
        for index in range(6):
            tideItem["level%s"%(index+1)] = ''
            tideItem["time%s"%(index+1)] = ''
        for index in range(len(tideLevelList)):
            tideItem["level%s"%(index+1)] = tideLevelList[index]
        for index in range(len(tideTimeList)):
            tideItem["time%s"%(index+1)] = tideTimeList[index].replace("%3A",":")
        yield tideItem