const user = require('../model/user')
const response = require('../config/response')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


exports.registrasiUser = (data) =>
    new Promise(async (resolve, reject)=>{
        user.findOne({
            email: data.email
        }).then(res=> {
            if (res){
                reject(response.commonErrorMsg("Email sudah digunakan"))
            }else {
                user.create(data)
                    .then(r => {
                        resolve(response.commonSuccessMsg("Berhasil Registrasi"))
                    }).catch(err =>{
                    reject(response.commonErrorMsg("Terjadi masalah pada server"))
                })
            }
        }).catch(err=>{
            reject(response.commonErrorMsg("Terjadi masalah pada server"))
        })
    })


exports.login = (data) =>
    new Promise(async (resolve, reject)=>{
        user.findOne({
            email: data.email
        }).then(res=> {
            if(res) {
                user.findOne({
                    password: data.password,
                    email: res.email
                }).then(r => {
                    if(r){
                        resolve(response.commonResult(r))
                    }else {
                        reject(response.commonErrorMsg("Password salah"))
                    }
                }).catch(err => {
                    reject(response.commonErrorMsg("Terjadi masalah pada server"))
                })
            }else {
                reject(response.commonErrorMsg("Email tidak ditemukan"))
            }
        }).catch(err=>{
            reject(response.commonErrorMsg("Terjadi masalah pada server"))
        })
    })

exports.updateUser = (data, id) =>
    new Promise(async (resolve, reject)=>{
        user.update(
            {
                _id: ObjectId(id)
            }, { $set: data }
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil merubah data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })
