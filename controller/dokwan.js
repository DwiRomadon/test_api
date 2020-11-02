const dokwan = require('../model/dokwan')
const utils = require('../model/utils')
const response = require('../config/response')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const haversine = require('haversine')
var distance = require('google-distance');
distance.apiKey = 'AIzaSyAukviuPQ_-gjcT7tM4dTwO1K_Kgqc-5WQ';

exports.inputData = (data, gambar) =>
    new Promise(async (resolve, reject)=>{
        const newDokwan = new dokwan(data)
        Object.assign(newDokwan,{gambar: gambar})
        newDokwan.save()
            .then(r=>{
                resolve(response.commonSuccessMsgWithId('Berhasil menginput data', newDokwan._id))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })


exports.getDokwan = (data, radius,idUser) =>
    new Promise(async (resolve, reject)=>{
        dokwan.aggregate([{
            $match: {
                idUser: ObjectId(idUser)
            }
        },{
            $lookup: {
                from: "users",
                localField: "idUser",
                foreignField: "_id",
                as: "users"
            }
        },
            {
                $lookup: {
                    from: "dokters",
                    localField: "_id",
                    foreignField: "idDokwan",
                    as: "dokters"
                }
            }
        ])
            .then(async r=>{
                let datas = []
                let originLatLong = data.latitude + "," + data.longitude
                for (i in r){
                    let latLongDesti = r[i].latitude + "," + r[i].longitude
                    let jarak = await getData(originLatLong, latLongDesti).then()
                    let rad = jarak.distance.replace("km", "")
                    let alamat = jarak.destination
                    if(Number(rad) <= Number(radius)){
                        datas.push({
                            namaTempat: r[i].namaTempat,
                            _id: r[i]._id,
                            nomorTelp: r[i].nomorTelp,
                            alamat: alamat,
                            gambar: r[i].gambar,
                            jarak: jarak,
                            latitude: r[i].latitude,
                            longitude: r[i].longitude,
                            idUser: r[i].idUser,
                            email: r[i].users[0].email,
                            jenisHewan: r[i].jenisHewan,
                            perawatan: r[i].perawatan,
                            dokters: r[i].dokters
                        })
                    }
                    if (Number(radius) === 0){
                        datas.push({
                            namaTempat: r[i].namaTempat,
                            _id: r[i]._id,
                            nomorTelp: r[i].nomorTelp,
                            alamat: alamat,
                            jarak: jarak,
                            gambar: r[i].gambar,
                            latitude: r[i].latitude,
                            longitude: r[i].longitude,
                            jenisHewan: r[i].jenisHewan,
                            perawatan: r[i].perawatan,
                            idUser: r[i].idUser,
                            email: r[i].users[0].email,
                            dokters: r[i].dokters
                        })
                    }
                }
                resolve(response.commonResult(datas.sort(compare)))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.getDokwanFav = (data, radius) =>
    new Promise(async (resolve, reject)=>{
        dokwan.aggregate([{
            $match: {
                fav: true
            }
        },{
            $lookup: {
                from: "users",
                localField: "idUser",
                foreignField: "_id",
                as: "users"
            }
        },
            {
                $lookup: {
                    from: "dokters",
                    localField: "_id",
                    foreignField: "idDokwan",
                    as: "dokters"
                }
            }
        ])
            .then(async r=>{
                let datas = []
                let originLatLong = data.latitude + "," + data.longitude
                for (i in r){
                    let latLongDesti = r[i].latitude + "," + r[i].longitude
                    let jarak = await getData(originLatLong, latLongDesti).then()
                    let rad = jarak.distance.replace("km", "")
                    let alamat = jarak.destination
                    if(Number(rad) <= Number(radius)){
                        datas.push({
                            namaTempat: r[i].namaTempat,
                            _id: r[i]._id,
                            nomorTelp: r[i].nomorTelp,
                            alamat: alamat,
                            gambar: r[i].gambar,
                            distance: jarak.distance,
                            duration: jarak.duration,
                            fav: r[i].fav,
                            jarak: jarak,
                            latitude: r[i].latitude,
                            longitude: r[i].longitude,
                            idUser: r[i].idUser,
                            email: r[i].users[0].email,
                            jenisHewan: r[i].jenisHewan,
                            perawatan: r[i].perawatan,
                            dokters: r[i].dokters
                        })
                    }
                    if (Number(radius) === 0){
                        datas.push({
                            namaTempat: r[i].namaTempat,
                            _id: r[i]._id,
                            nomorTelp: r[i].nomorTelp,
                            alamat: alamat,
                            jarak: jarak,
                            fav: r[i].fav,
                            distance: jarak.distance,
                            duration: jarak.duration,
                            gambar: r[i].gambar,
                            latitude: r[i].latitude,
                            longitude: r[i].longitude,
                            jenisHewan: r[i].jenisHewan,
                            perawatan: r[i].perawatan,
                            idUser: r[i].idUser,
                            email: r[i].users[0].email,
                            dokters: r[i].dokters
                        })
                    }
                }
                resolve(response.commonResult(datas.sort(compare)))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })


exports.hapusData = (id) =>
    new Promise(async (resolve, reject)=>{
        dokwan.deleteOne(
            {
                _id: ObjectId(id)
            },
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil menghapus data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.getDokwanHistroy = (data, radius) =>
    new Promise(async (resolve, reject)=>{
        dokwan.aggregate([{
            $match: {
                history: true
            }
        },{
            $lookup: {
                from: "users",
                localField: "idUser",
                foreignField: "_id",
                as: "users"
            }
        },
            {
                $lookup: {
                    from: "dokters",
                    localField: "_id",
                    foreignField: "idDokwan",
                    as: "dokters"
                }
            }
        ])
            .then(async r=>{
                let datas = []
                let originLatLong = data.latitude + "," + data.longitude
                for (i in r){
                    let latLongDesti = r[i].latitude + "," + r[i].longitude
                    let jarak = await getData(originLatLong, latLongDesti).then()
                    let rad = jarak.distance.replace("km", "")
                    let alamat = jarak.destination
                    if(Number(rad) <= Number(radius)){
                        datas.push({
                            namaTempat: r[i].namaTempat,
                            _id: r[i]._id,
                            nomorTelp: r[i].nomorTelp,
                            alamat: alamat,
                            gambar: r[i].gambar,
                            distance: jarak.distance,
                            duration: jarak.duration,
                            fav: r[i].fav,
                            jarak: jarak,
                            latitude: r[i].latitude,
                            longitude: r[i].longitude,
                            idUser: r[i].idUser,
                            email: r[i].users[0].email,
                            jenisHewan: r[i].jenisHewan,
                            perawatan: r[i].perawatan,
                            dokters: r[i].dokters
                        })
                    }
                    if (Number(radius) === 0){
                        datas.push({
                            namaTempat: r[i].namaTempat,
                            _id: r[i]._id,
                            nomorTelp: r[i].nomorTelp,
                            alamat: alamat,
                            jarak: jarak,
                            fav: r[i].fav,
                            distance: jarak.distance,
                            duration: jarak.duration,
                            gambar: r[i].gambar,
                            latitude: r[i].latitude,
                            longitude: r[i].longitude,
                            jenisHewan: r[i].jenisHewan,
                            perawatan: r[i].perawatan,
                            idUser: r[i].idUser,
                            email: r[i].users[0].email,
                            dokters: r[i].dokters
                        })
                    }
                }
                resolve(response.commonResult(datas.sort(compare)))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.getDokwanUser = (data, radius) =>
    new Promise(async (resolve, reject)=>{
        dokwan.aggregate([
            {
            $lookup: {
                from: "users",
                localField: "idUser",
                foreignField: "_id",
                as: "users"
            }
        },
            {
                $lookup: {
                    from: "dokters",
                    localField: "_id",
                    foreignField: "idDokwan",
                    as: "dokters"
                }
            }
        ])
            .then(async r=>{
                let datas = []
                let originLatLong = data.latitude + "," + data.longitude
                for (i in r){
                    let latLongDesti = r[i].latitude + "," + r[i].longitude
                    let jarak = await getData(originLatLong, latLongDesti).then()
                    let rad = jarak.distance.replace("km", "")
                    let alamat = jarak.destination
                    if(Number(rad) <= Number(radius)){
                        datas.push({
                            namaTempat: r[i].namaTempat,
                            _id: r[i]._id,
                            nomorTelp: r[i].nomorTelp,
                            alamat: alamat,
                            gambar: r[i].gambar,
                            distance: jarak.distance,
                            duration: jarak.duration,
                            fav: r[i].fav,
                            jarak: jarak,
                            latitude: r[i].latitude,
                            longitude: r[i].longitude,
                            idUser: r[i].idUser,
                            email: r[i].users[0].email,
                            jenisHewan: r[i].jenisHewan,
                            perawatan: r[i].perawatan,
                            dokters: r[i].dokters
                        })
                    }
                    if (Number(radius) === 0){
                        datas.push({
                            namaTempat: r[i].namaTempat,
                            _id: r[i]._id,
                            nomorTelp: r[i].nomorTelp,
                            alamat: alamat,
                            jarak: jarak,
                            fav: r[i].fav,
                            distance: jarak.distance,
                            duration: jarak.duration,
                            gambar: r[i].gambar,
                            latitude: r[i].latitude,
                            longitude: r[i].longitude,
                            jenisHewan: r[i].jenisHewan,
                            perawatan: r[i].perawatan,
                            idUser: r[i].idUser,
                            email: r[i].users[0].email,
                            dokters: r[i].dokters
                        })
                    }
                }
                resolve(response.commonResult(datas.sort(compare)))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })


const getData = (latLongOrigin, latLongDesti) =>
    new Promise(async (resolve, reject)=>{
        await distance.get(
            {
                origin: latLongOrigin,
                destination: latLongDesti
            },
            function(err, data) {
                if (err) {return console.log(err);}
                resolve(data)

            });
    })

exports.updateDataDokswa = (data, id) =>
    new Promise(async (resolve, reject)=>{
        dokwan.update(
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


exports.updateDataGambar = (data, id) =>
    new Promise(async (resolve, reject)=>{
        console.log(data)
        dokwan.update(
            {
                _id: ObjectId(id)
            }, { $push: {gambar: data} }
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil merubah data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.updateData = (data, id) =>
    new Promise(async (resolve, reject)=>{
        dokwan.update(
            {
                _id: ObjectId(id)
            }, { $addToSet: data }
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil merubah data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.updateDataJenisHewan= (data, id, idJenisHewan) =>
    new Promise(async (resolve, reject)=>{
        var jenisHewan = data.jenisHewan[0]
        console.log(jenisHewan.nama)
        dokwan.update(
            {
                _id: ObjectId(id),
                "jenisHewan._id" : ObjectId(idJenisHewan)
            }, { $set: {
                    "jenisHewan.$.nama": jenisHewan.nama,
                }
            }
        )
            .then(r=>{
                console.log(r)
                resolve(response.commonSuccessMsg('Berhasil merubah data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.hapusDataJenisHewan = (id, idJenis) =>
    new Promise(async (resolve, reject)=>{
        dokwan.update(
            {
                _id: ObjectId(id),
            }, {
                $pull: {
                    "jenisHewan" : {
                        _id: ObjectId(idJenis)
                    }
                }
            }
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil menghapus data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Hapus Data Gagal'))
        })
    })


exports.updateDataPerawatan= (data, id, idPerawatan) =>
    new Promise(async (resolve, reject)=>{
        var perawatan = data.perawatan[0]
        dokwan.update(
            {
                _id: ObjectId(id),
                "perawatan._id" : ObjectId(idPerawatan)
            }, { $set: {
                    "perawatan.$.nama": perawatan.nama,
                }
            }
        )
            .then(r=>{
                console.log(r)
                resolve(response.commonSuccessMsg('Berhasil merubah data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.hapusDataPerawatan = (id, idJenis) =>
    new Promise(async (resolve, reject)=>{
        dokwan.update(
            {
                _id: ObjectId(id),
            }, {
                $pull: {
                    "perawatan" : {
                        _id: ObjectId(idJenis)
                    }
                }
            }
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil menghapus data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Hapus Data Gagal'))
        })
    })

const compare = (a, b) => {
    const jarakA = Number(a.jarak.distance.replace("km", "").toUpperCase());
    const jarakB = Number(b.jarak.distance.replace("km", "").toUpperCase());
    let comparison = 0;
    if (jarakA > jarakB) {
        comparison = 1;
    } else if (jarakA < jarakB) {
        comparison = -1;
    }
    return comparison;
}
