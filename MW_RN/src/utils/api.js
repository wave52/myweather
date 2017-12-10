
var api = {}
//API地址："http://192.168.0.120:8080/haixin"
//备用地址："http://192.168.0.120:8080/haixin"credentials:'include',
var API = "http://localhost:5000"

//POST
api.callJson = function(uri){
    return function(data){
        return new Promise(function(resolve,reject){
            if(typeof data=='string') data=data
            else data=JSON.stringify(data)
            fetch(API+uri,{body:data,method:'POST'}).then(function(res){
                if(res.ok)return res.json();
            }).then(function(res){
                if(!res) reject(404)
                if(typeof res.code=="undefined")resolve(res)
                if(res.code==1)resolve(res.result)
                else reject(res.message)
            }).catch(function(){
                reject()
            })
        })
    }
}
//GET
api.getJson = function(uri){
    return function(){
        return new Promise(function(resolve,reject){
            fetch(API+uri).then(function(res){
                if(res.ok)return res.json();
            }).then(function(res){
                if(!res) reject(404)
                if(typeof res.code=="undefined")resolve(res)
                if(res.code==1)resolve(res.result)
                else reject(res.message)
            }).catch(function(e){
                reject(e)
            })
        })
    }
}
//上传
api.upload = function(uri){
    return function(data){
        return new Promise(function(resolve,reject){
            fetch(API+uri,{body:data,method:'POST'}).then(function(res){
                if(res.ok)return res.json();
            }).then(function(res){
                if(!res) reject(404)
                if(typeof res.code=="undefined")resolve(res)
                if(res.code==0)resolve(res.data)
                else reject(res.msg)
            }).catch(function(e){
                reject(e)
            })
        })
    }
}
//下载
api.download = function(uri){
    return function(data){
        return new Promise(function(resolve,reject){
            fetch(API+api.setUrl(uri),{credentials:'include',body:JSON.stringify(data),method:'POST',headers:{'X-DEVICE':'web'}}).then(res => res.blob().then(blob => {
                console.log(blob)
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(blob);
                var filename = 'myfile.xlsx';
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            }).catch((msg)=>{
                console.log(msg)
            }))
        })
    }
}
//设置url
api.setUrl = function(uri){
    return uri.indexOf("/login") >= 0?uri:(uri+"?access_token="+apiData.token)
}
//获取url:下载链接等
api.getUrl = function(uri,t){
    return uri.indexOf("/login") >= 0?(API+uri):(API+uri+"?access_token="+apiData.token)
}
module.exports = api