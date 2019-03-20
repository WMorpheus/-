# -*- coding: utf-8 -*-
# @Time    : 2018/8/19 15:14
# @Author  : UNE
# @Project : PufaBaidu
# @File    : app.py
# @Software: PyCharm

import os, sys
import sqlite3
from flask import Flask, request, g, url_for, abort, jsonify, send_from_directory
import pandas as pd

app = Flask(__name__)
app.config.from_object(__name__)

# Load default config and override config from an environment variable
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'stockdata.db'),
    SECRET_KEY='development_key',
    USERNAME='admin',
    PASSWORD='123456'
))


def connect_db():
    """Connects to the specific database."""
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.text_factory = str
    rv.row_factory = sqlite3.Row
    return rv

def get_db():
    """Opens a new database connection if there is none yet for the
    current application context.
    """
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

def init_db():
    db = get_db()
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()


@app.cli.command('initdb')
def initdb_command():
    """Initializes the database."""
    init_db()
    print('Initialized the database.')

@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

@app.route('/mystock',methods=['GET'])
def getMystock():
    db = get_db()
    cur = db.execute("select stock_code,stock_name,up,down from mystocks")

    rows = cur.fetchall()
    data =[]
    for row in rows:
        data.append({"stockcode":row[0],"stockname":row[1],"up":round(row[2],2),"down":round(row[3],2)})
    if len(data)== 0:
        return jsonify({"errno": 1, "errmsg": "Invalid userid!"})
    else:
        return jsonify({"errno": 0, "errmsg": "success", "data": data})
        
        
@app.route('/deletestock',methods=['POST'])
def stock_delete():
    db=get_db()
    req=request.json
    stock=req['stockcode']
    try:
        db.execute("delete from mystocks where stock_code = ('"+ stock +"')")
        db.commit()
        return jsonify({"state":"success"})
    except:
        return jsonify({"state":"fail"})
    

@app.route('/addstock',methods=['POST'])
def stock_increase():

    db = get_db()
    req = request.json
    stocks = req['stockcode']
    date = req['date']
    try:
        cur = db.execute("select PredictResult.stockcode,stockname ,up,down from PredictResult join StockInfo on PredictResult.stockcode=StockInfo.stockcode where PredictResult.stockcode =('"+stocks+"') and day=('"+date+"')")

        data = []
        rows = cur.fetchall()

        for row in rows:
            data.append([row[0],row[1],row[2],row[3]])
        d = data[0]

        cur_insert = db.execute("insert into mystocks(stock_code,stock_name,up,down) values('%s','%s','%f','%f')" %(d[0],d[1],d[2],d[3]))

	#cur_insert = db.execute("insert into mystocks(stock_code,stock_name,up,down) values(d[0],d[1],d[2],d[3])")
	#cur_insert = db.execute("insert into mystocks ('qw','qr','3','4')")
        db.commit()


        return jsonify({"state":"success"})
    except:
        return jsonify({"state":"fail"})


@app.route('/top10/<date>', methods=['GET'])
def getTop(date):

    datetime = pd.to_datetime(date)
    date = str(datetime.date())

    db = get_db()
    cur = db.execute("select Temp.stockcode, stockname, up from (SELECT stockcode, up from PredictResult "
                     "where day=DATE('" + date + "') order by up desc limit 0,10)as Temp left join StockInfo "
                                             "on Temp.stockcode=StockInfo.stockcode;")
    rows = cur.fetchall()
    data = []
    for row in rows:
        data.append([row[0], row[1], row[2]])

    # if not entries:
    if len(data) == 0:
        return jsonify({"errno": 1, "errmsg": "Invalid userid!"})
    else:
        return jsonify({"errno": 0, "errmsg": "success", "data": data})

@app.route('/firstpage/<date>',methods=['GET'])
def getfirst(date):

    datetime = pd.to_datetime(date)
    day = datetime.strftime("%Y-%m-%d")
    #date1 = str(datetime.date())
    db = get_db()
    cur = db.execute("SELECT Temp.stockcode, stockname, up from (SELECT stockcode, up from PredictResult where day=DATE('" + day + "') and up>=0.5 order by up desc)as Temp left join StockInfo on Temp.stockcode=StockInfo.stockcode")
    uprows = cur.fetchall()
    updata = []
    for row in uprows:
        updata.append({"stockcode":row[0],"stockname": row[1], "up":round(row[2],2),"down":round(1-row[2],2)})

    cur = db.execute("SELECT Temp.stockcode, stockname, down from (SELECT stockcode, down from PredictResult where day=DATE('" + day + "') and down>=0.5 order by down desc)as Temp left join StockInfo on Temp.stockcode=StockInfo.stockcode")
    downrows = cur.fetchall()
    downdata = []
    for row in downrows:
        downdata.append({"stockcode":row[0],"stockname":row[1],"up":round(1-row[2],2),"down":round(row[2],2)})

    print(updata, downdata)

    # if not entries:
    if len(updata) == 0 or len(downdata) == 0:
        return jsonify({"errno": 1, "errmsg": "Invalid userid!"})
    else:
        return jsonify({"errno": 0, "errmsg": "success", "updata": updata, 'downdata': downdata})




@app.route('/search', methods=['POST'])
def getstockinfo():
    req = request.json
    scode = req['stockcode']
    date = req['date']
    date = pd.to_datetime(date)
    lastdate = date - pd.to_timedelta('24:00:00')*30

    db = get_db()
    cur = db.execute("SELECT * FROM (SELECT * from PredictResult where stockcode='" + scode + "' "
                     "and day=date('" + str(date.date()) + "')) as Temp left join StockInfo "
                    "on Temp.stockcode=StockInfo.stockcode")
    Probrows = cur.fetchall()

    Probdata = []
    for row in Probrows:
        Probdata.append([row[0], row[1], row[2], row[3], row[5]])
    cur = db.execute("SELECT * from Stocks where stockcode='" + scode + "' and day<date('" + str(date.date()) + "') "
                     "and day>=date('"+ str(lastdate.date()) +"')")
    Hisrows = cur.fetchall()
    Hisdata = {'stockcode': scode,
               'datacol': ['EP','BP','DP','PEG','CFP','PS','CAP','CIR_CAP','ARL','ROE','ROA','MTM1','MTM3','MEM6','MEM12','sentiscore','price'],
               'data': []
               }
    for row in Hisrows:
        Hisdata['data'].append([row[i] for i in range(1, 19)])

    # if not entries:
    if len(Probdata) == 0 or len(Hisdata) == 0:
        return jsonify({"errno": 1, "errmsg": "Invalid userid!"})
    else:
        return jsonify({"errno": 0, "errmsg": "success", "Probdata": Probdata, 'Hisdata': Hisdata})

'''
@app.route('/mystock', methods=['POST'])
def getuserstocks():
    req = request.json
    scodes = req['stockcodes']
    date = req['date']

    db = get_db()
    data = []
    for scode in scodes:
        cur = db.execute("SELECT * FROM (SELECT * from PredictResult where stockcode='" + scode + "' "
                         "and day=date('" + str(date.date()) + "')) as Temp left join StockInfo "
                           "on Temp.stockcode=StockInfo.stockcode")
        rows = cur.fetchall()
        for row in rows:
            data.append([row[0], row[1], row[2], row[3]])

    # if not entries:
    if len(data) == 0:
        return jsonify({"errno": 1, "errmsg": "Invalid userid!"})
    else:
        return jsonify({"errno": 0, "errmsg": "success", "userinfo": data})
'''

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10010, debug=True)