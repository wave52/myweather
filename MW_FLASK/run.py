# -*- coding: utf-8 -*-

from flask import Flask, make_response, jsonify, request
from functools import wraps
import string
import json
import MySQLdb
import urllib2

app = Flask(__name__)

# SQL
sql1 = 'SELECT * FROM `mw_city` WHERE `city` = %s'
sql2 = 'SELECT * FROM `mw_base_info` WHERE `city_id` = %s AND `date_id` = 1'
sql3 = 'SELECT * FROM `mw_air` WHERE `city_id` = %s'
sql4 = 'SELECT * FROM `mw_wind` WHERE `city_id` = %s AND `date_id` = 1'
sql5 = 'SELECT * FROM `mw_one_day` WHERE `city_id` = %s'
sql6 = 'SELECT * FROM `mw_alarm` WHERE `city_id` = %s'

# 跨域修饰器函数
def allow_cross_domain(fun):
    @wraps(fun)
    def wrapper_fun(*args, **kwargs):
        rst = make_response(fun(*args, **kwargs))
        rst.headers['Access-Control-Allow-Origin'] = '*'
        rst.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        rst.headers['Access-Control-Allow-Headers'] = 'Referer,Accept,Origin,Content-Type'
        return rst
    return wrapper_fun

# 连接数据库
def connect_mysql(db_host="127.0.0.1", user="root",db="mw"):
    conn = MySQLdb.connect(host=db_host, user=user, db=db, charset='utf8')
    conn.autocommit(True)
    return conn.cursor()

# 定义response模版
def set_res(result,message,code):
    try:
        return json.dumps({'result':result,'message':message,'code':code})
    except:
        return json.dumps({'result':'','message':'请求失败','code':0})

# jsonp解析
def loads_jsonp(_jsonp):
    try:
        return json.loads(re.match(".*?({.*}).*",_jsonp,re.S).group(1))
    except:
        raise ValueError('Invalid Input')

# /location 定位
@app.route('/location', methods=['POST'])
@allow_cross_domain
def citylocation():
    reqJson = json.loads(request.get_data())
    lon = reqJson['coords']['longitude']
    la = reqJson['coords']['latitude']
    # 百度json
    url = 'http://api.map.baidu.com/geocoder/v2/?location=%s,%s&output=json&pois=1&ak=7yWZNEj7Hn7ZOLYWb0UqBiZKKbIEZqR0'%(la,lon)
    req = urllib2.Request(url)
    res_data = urllib2.urlopen(req)
    res = res_data.read()
    city = json.loads(res)['result']['addressComponent']['city'][0:-1]
    return set_res(city_info(city),"请求成功",1)

# /city 城市名搜索
@app.route('/city', methods=['POST'])
@allow_cross_domain
def citypost():
    reqJson = json.loads(request.get_data())
    city = reqJson['city']
    return set_res(city_info(city),"请求成功",1)

# /sevenday
@app.route('/sevenday', methods=['POST'])
@allow_cross_domain
def sevenday():
    reqJson = json.loads(request.get_data())
    city = reqJson['city']
    return set_res("11111","请求成功",1)

# /oneday
@app.route('/oneday', methods=['POST'])
@allow_cross_domain
def oneday():
    reqJson = json.loads(request.get_data())
    city_id = reqJson['city']['id']
    return set_res(oneInfo(city_id),"请求成功",1)

# /special
@app.route('/special', methods=['POST'])
@allow_cross_domain
def special():
    reqJson = json.loads(request.get_data())
    city_id = reqJson['city']['id']
    return set_res(alarm(city_id),"请求成功",1)

# 城市基本信息
def city_info(cityName):
    db = connect_mysql()
    # 城市表
    db.execute(sql1, [cityName])
    city = db.fetchall()[0]
    # 基本信息表
    db.execute(sql2, [city[0]])
    baseInfo = db.fetchall()[0]
    # 空气表
    db.execute(sql3, [city[0]])
    air = db.fetchall()[0]
    # 风力表
    db.execute(sql4, [city[0]])
    wind = db.fetchall()[0]
    # 返回值
    result = {}
    result['id'] = city[0]
    result['city'] = city[1]
    result['base_describe'] = baseInfo[3]
    result['now_temp'] = baseInfo[4]
    result['humidity'] = baseInfo[7]
    result['rain'] = baseInfo[8]
    result['aqi'] = air[3]
    result['wind_describe'] = wind[3]
    result['wind_direction'] = wind[4]
    return result

def sevenInfo(cityId):
    result = {}
    return result

def oneInfo(cityId):
    db = connect_mysql()
    db.execute(sql5, [cityId])
    data = db.fetchall()[0]
    result = {}
    result['oneDayData'] = json.loads(data[2])
    return result

def alarm(cityId):
    result = {}
    db = connect_mysql()
    db.execute(sql6, [cityId])
    data = db.fetchall()[0]
    result['alarmList'] = json.loads(data[2])
    return result

if __name__ == '__main__':
    app.run(debug=True)