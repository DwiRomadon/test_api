const dokter = require('../model/dokter')
const response = require('../config/response')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const haversine = require('haversine')
var distance = require('google-distance');
distance.apiKey = 'AIzaSyAukviuPQ_-gjcT7tM4dTwO1K_Kgqc-5WQ';

exports.inputData = (data) =>
    new Promise(async (resolve, reject)=>{
        const newDokter = new dokter(data)
        newDokter.save()
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil menginput data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.getdokter = (idDokwan) =>
    new Promise(async (resolve, reject)=>{
        dokter.find({
            idDokwan: ObjectId(idDokwan)
        })
            .then(r=>{
                resolve(response.commonResult(r))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.updateDataDokter = (data, id) =>
    new Promise(async (resolve, reject)=>{
        dokter.update(
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


exports.hapusDataDokter = (id) =>
    new Promise(async (resolve, reject)=>{
        dokter.remove(
            {
                _id: ObjectId(id)
            }
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil Menghapus data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })


exports.updateDataHari = (data, id, hari) =>
    new Promise(async (resolve, reject)=>{
        dokter.update(
            {
                idDokwan: ObjectId(id),
                "jadwalLayanan.hari" : hari
            }, { $set: {"jadwalLayanan.$.jam": data.jam} }
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil merubah data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })
