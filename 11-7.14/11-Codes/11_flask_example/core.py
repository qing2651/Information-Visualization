import sys

def return_sum(eventname, data1, data2):
    res = {'event': eventname, 'result': data1 + data2}
    return res

def return_string(data1, data2, data3):
    res = {'dataStr': data1, 'dataValA': data2, 'dataValB': data3}
    return res