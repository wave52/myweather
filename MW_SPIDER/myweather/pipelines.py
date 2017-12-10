# -*- coding: utf-8 -*-

# Define your item pipelines here

import MySQLdb
import datetime
import json
import codecs

DEBUG = False
if DEBUG:
    dbuser = 'root'
    dbpass = ''
    dbname = 'myweather'
    dbhost = '192.168.1.100'
    dbport = '3306'
else:
    dbuser = 'root'
    dbpass = ''
    dbname = 'mw'
    dbhost = '127.0.0.1'
    dbport = '3306'

class JsonWriterPipeline(object):

    def __init__(self):
        self.file = codecs.open('items.json', 'wb')

    def process_item(self, item, spider):
        line = json.dumps(dict(item)) + "\n"
        self.file.write(line)
        return item

class MySQLStorePipeline(object):
    def __init__(self):
        self.conn = MySQLdb.connect(user=dbuser, db=dbname, host=dbhost, charset="utf8", use_unicode=True)
        self.cursor = self.conn.cursor()
        #清空表：
        # self.cursor.execute("truncate table mw_city;")
        # self.cursor.execute("truncate table mw_base_info;")
        # self.cursor.execute("truncate table mw_air;")
        # self.cursor.execute("truncate table mw_tide;")
        # self.cursor.execute("truncate table mw_wind;")
        # self.cursor.execute("truncate table mw_one_day;")
        self.conn.commit()
    def process_item(self, item, spider):
        try:
            if spider.name in ['bi']:
                if "city_name" in item:
                    self.cursor.execute("""INSERT INTO
                                        mw_city (id,city)
                                        VALUES (%s,%s)
                                        ON DUPLICATE KEY UPDATE
                                        city=%s""",
                                        (item["city_id"],item["city_name"],
                                         item["city_name"])
                                        )
                    self.conn.commit()
                elif "base_describe" in item:
                    self.cursor.execute("""INSERT INTO
                                        mw_base_info (city_id, date_id, base_describe, max_temp, min_temp)
                                        VALUES (%s, %s, %s, %s, %s)
                                        ON DUPLICATE KEY UPDATE
                                        city_id=%s,date_id=%s,base_describe=%s,max_temp=%s,min_temp=%s""",
                                        (item["city_id"], item["date_id"], item["base_describe"], item["max_temp"], item["min_temp"],
                                         item["city_id"],item["date_id"],item["base_describe"],item["max_temp"],item["min_temp"])
                                        )
                    self.conn.commit()
                elif "wind_direction" in item:
                    self.cursor.execute("""INSERT INTO
                                        mw_wind (city_id, date_id, wind_describe, wind_direction)
                                        VALUES (%s, %s, %s, %s)
                                        ON DUPLICATE KEY UPDATE
                                        city_id=%s,date_id=%s,wind_describe=%s,wind_direction=%s""",
                                        (item["city_id"],item["date_id"],item["wind_describe"],item["wind_direction"],
                                         item["city_id"],item["date_id"],item["wind_describe"],item["wind_direction"])
                                        )
                    self.conn.commit()
            elif spider.name in ['bs']:
                if "rain" in item:
                    self.cursor.execute("""UPDATE
                                        mw_base_info SET now_temp=%s, humidity=%s, rain=%s
                                        WHERE city_id = %s AND date_id = 1 """,
                                        (item["now_temp"],item["humidity"],item["rain"],
                                         item["city_id"])
                                        )
                    self.conn.commit()
                if "wind_power" in item:
                    # self.cursor.execute("""INSERT INTO
                    #                     mw_wind (wind_power, wind_direction)
                    #                     VALUES (%s, %s)
                    #                     ON DUPLICATE KEY UPDATE
                    #                     wind_power=%s, wind_direction=%s""",
                    #                     (item["wind_power"],item["wind_direction"],
                    #                      item["wind_power"],item["wind_direction"])
                    #                     )
                    # self.conn.commit()
                    self.cursor.execute("""UPDATE
                                        mw_wind SET wind_power=%s, wind_direction=%s
                                        WHERE city_id = %s AND date_id = 1""",
                                        (item["wind_power"],item["wind_direction"],
                                         item["city_id"])
                                        )
                    self.conn.commit()
            elif spider.name in ['air']:
                self.cursor.execute("""INSERT INTO
                                    mw_air (city_id, AQI, PM_2_5, PM10, CO, NO2)
                                    VALUES (%s, %s, %s, %s, %s, %s)
                                    ON DUPLICATE KEY UPDATE
                                    city_id=%s,AQI=%s,PM_2_5=%s,PM10=%s,CO=%s,NO2=%s""",
                                    (item["city_id"], item["aqi"], item["pm2_5"], item['pm10'], item['co'], item['no2'],
                                     item["city_id"],item["aqi"],item["pm2_5"],item["pm10"],item["co"],item["no2"])
                                    )
                self.conn.commit()
            elif spider.name in ['tide']:
                self.cursor.execute("""INSERT INTO
                                    mw_tide (id, name, tide_time1, tide_time2, tide_time3, tide_time4, tide_time5, tide_time6,
                                    tide_level1, tide_level2, tide_level3, tide_level4, tide_level5, tide_level6)
                                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                                    ON DUPLICATE KEY UPDATE
                                    tide_time1=%s, tide_time2=%s, tide_time3=%s, tide_time4=%s, tide_time5=%s, tide_time6=%s,
                                    tide_level1=%s, tide_level2=%s, tide_level3=%s, tide_level4=%s, tide_level5=%s, tide_level6=%s""",
                                    (item["port_id"], item["name"], item["time1"], item["time2"], item["time3"], item["time4"], item["time5"], item["time6"],
                                    item["level1"], item["level2"], item["level3"], item["level4"], item["level5"], item["level6"],
                                    item["time1"], item["time2"], item["time3"], item["time4"], item["time5"], item["time6"],
                                    item["level1"], item["level2"], item["level3"], item["level4"], item["level5"], item["level6"])
                                    )
                self.conn.commit()
            elif spider.name in ['od']:
                self.cursor.execute("""INSERT INTO
                                    mw_one_day (city_id, city_json)
                                    VALUES (%s, %s)
                                    ON DUPLICATE KEY UPDATE
                                    city_id=%s,city_json=%s""",
                                    (item["city_id"],item["city_json"],
                                     item["city_id"],item["city_json"])
                                    )
                self.conn.commit()
            elif spider.name in ['alarm']:
                self.cursor.execute("""INSERT INTO
                                    mw_alarm (city_id, city_json)
                                    VALUES (%s, %s)
                                    ON DUPLICATE KEY UPDATE
                                    city_id=%s,city_json=%s""",
                                    (item["city_id"],item["city_json"],
                                     item["city_id"],item["city_json"])
                                    )
                self.conn.commit()
        except MySQLdb.Error, e:
            print "Error %d: %s" % (e.args[0], e.args[1])
        return item