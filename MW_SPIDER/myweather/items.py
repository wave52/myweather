# -*- coding: utf-8 -*-

# Define here the models for your scraped items

import scrapy

# 城市
class CityItem(scrapy.Item):
    city_id  = scrapy.Field()
    city_name = scrapy.Field()
    pass

# 基本信息
class BaseInfoItem(scrapy.Item):
    city_id = scrapy.Field()
    date_id = scrapy.Field()
    base_describe = scrapy.Field()
    now_temp = scrapy.Field()
    max_temp = scrapy.Field()
    min_temp = scrapy.Field()
    humidity = scrapy.Field()
    rain = scrapy.Field()
    pass

# 风力
class WindItem(scrapy.Item):
    city_id = scrapy.Field()
    date_id = scrapy.Field()
    wind_describe = scrapy.Field()
    wind_direction = scrapy.Field()
    wind_power = scrapy.Field()
    pass

# 空气
class AirItem(scrapy.Item):
    city_id  = scrapy.Field()
    aqi = scrapy.Field()
    pm2_5 = scrapy.Field()
    pm10 = scrapy.Field()
    co = scrapy.Field()
    no2 = scrapy.Field()
    pass

# 潮汐
class TideItem(scrapy.Item):
    port_id = scrapy.Field()
    name = scrapy.Field()
    time1 = scrapy.Field()
    level1 = scrapy.Field()
    time2 = scrapy.Field()
    level2 = scrapy.Field()
    time3 = scrapy.Field()
    level3 = scrapy.Field()
    time4 = scrapy.Field()
    level4 = scrapy.Field()
    time5 = scrapy.Field()
    level5 = scrapy.Field()
    time6 = scrapy.Field()
    level6 = scrapy.Field()
    pass

class OneDayItem(scrapy.Item):
    city_id = scrapy.Field()
    city_json = scrapy.Field()
    pass

class AlarmItem(scrapy.Item):
    city_id = scrapy.Field()
    city_json = scrapy.Field()
    pass

