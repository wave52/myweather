#usr/bin/python

import os
import time

times = 0
while True:
    times += 1
    print "start crawl.It is the %d times." %times
    os.popen('scrapy crawl bi')
    os.popen('scrapy crawl bs')
    os.popen('scrapy crawl air')
    os.popen('scrapy crawl tide')
    print "end crawl.It is the %d times." %times
    time.sleep(3600)