const express = require("express");
const app = express()
const port = 3000
const bodyParser = require("body-parser")
const db = require("./connection")
const response = require('./response')


app.use(bodyParser.json())

app.get('/respon', (req, res)=> {
    const sql = "SELECT * FROM mahasiswa"
    db.query(sql, (err, fields)=> {
        // JIKA ADA YG SALAH
        if(err) throw err
        response(200, fields, "success", res)
    })
})

app.get('/mahasiswa/:nim', (req, res)=> {
    const nim = req.params.nim
    const sql = `SELECT * FROM mahasiswa WHERE nim = ${nim}`
    db.query(sql, (err, fields)=> {
        // jika ada error
        if(err) throw err
        response(200, fields, "success", res)
    })
})

app.put('/mahasiswa', (req, res)=> {
    response(200, 'ini data', 'ini post', res)
})



app.post('/mahasiswa', (req, res)=> {
    const { nim, nama_lengkap, kelas, alamat } = req.body
    const sql = `INSERT INTO mahasiswa ( nim, nama_lengkap, kelas, alamat) VALUES (${nim}, "${nama_lengkap}", "${kelas}", "${alamat}")`
    const sql_nama = `SELECT * FROM mahasiswa WHERE nama_lengkap="${nama_lengkap}" `

    db.query(sql_nama, (err, fields)=>{
        if(err) response(500, err, 'error', res)

        if(fields.length < 1 ) {
        db.query(sql, (err, fields)=>{
            // jika terjadi error
            if(err) response(500, 'invalid', 'error', res)
            //      // jika ada isinya
            if(fields?.affectedRows){
                response(200, fields.insertId, 'Data berhasil ditambahkan', res)
            }
        })
        }
        else{
            response(400, fields, 'nama telah terdaftar', res)
        }
    }) 


    // db.query(sql, (err, fields)=>{
    //     // jika terjadi error
    //     if(err) response(500, 'invalid', 'error', res)
    //     //      // jika ada isinya
    //     if(fields?.affectedRows){
    //         response(200, fields.insertId, 'Data berhasil ditambahkan', res)
    //     }
    // })
})


app.get('/seluruhMahasiswa', (req, res)=> {
    const limit_query = req.query.limit
    const sql = `SELECT * FROM mahasiswa limit ${limit_query}`
    db.query(sql, (err, fields)=>{
        if(err) throw err

        if(fields){
            response(200, fields, 'seluruh data', res)
        }
    })
})


app.get('/seluruhMahasiswa2', (req, res)=> {
    const limit_query = req.query.limit
    const limit_page = req.query.pag

    const offset = limit_query * (limit_page -1);

    // const offset = limit_query * (limit_page-1);

    const sql = `SELECT * FROM mahasiswa limit ${limit_query} OFFSET ${offset}`
    db.query(sql, (err, fields)=>{
        if(err) throw err

        if(fields){
            response(200, fields, 'seluruh data', res)
        }
    })
})


app.get('/mahasiswagenap', (req, res)=> {
    const limit_query1 = req.query.limit
    const sql = `SELECT id, nama_lengkap, kelas, alamat FROM mahasiswa WHERE (id % 2) = 0 limit ${limit_query1} `

    db.query(sql, (err, fields)=> {
        if(err) throw err
        if(fields){
            response(200, fields, 'sukses', res)
        }
    })
})


// SOAL 2 TABLE
// No 1 INSERT DATA JURUSAN
app.post('/jurusan', (req, res)=> {
    const { nama_jurusan } = req.body
    const sql = `INSERT INTO jurusan(nama_jurusan) VALUES ('${nama_jurusan}')` 

    db.query(sql, (err, fields)=> {
        if(err) response(500, err, 'error', res)
        if(fields){
            response(200, fields, 'nama jurusan', res)
        }
    })
})

// NO 2 MENGAMBIL SELURUH JURUSAN
app.get('/seluruhjurusan', (req, res)=> {
    const sql = `SELECT * FROM jurusan`

    db.query(sql, (err, fields)=> {
        if(err) throw err
        if(fields){
            response(200, fields, 'seluruh jurusan', res)
        }
    })
})


// NO 3 
app.get('/idjurusan/:id', (req, res)=> {
    const id_jurusan = req.params.id
    const sql = `SELECT mahasiswa.id, mahasiswa.nama_lengkap,
     mahasiswa.kelas, mahasiswa.alamat, mahasiswa.id_jurusan, jurusan.id, jurusan.nama_jurusan
    FROM mahasiswa
    JOIN jurusan
    ON jurusan.id = mahasiswa.id_jurusan
    WHERE mahasiswa.id_jurusan = ${id_jurusan}`

    db.query(sql, (err, fields)=> {
        if(err) throw err
        if(fields){
            response(200, fields, 'idjurusan', res)
        }
    })
})

// NO 4 DELETE MAHASISWA DENGAN ID MAHASISWA
app.delete('/deletemahasiswa/:id', (req, res)=> {
    const id_mahasiswa = req.params.id
    const sql = `DELETE FROM mahasiswa WHERE id = ${id_mahasiswa}`

    db.query(sql, (err, fields)=> {
        if(err) throw err
        if(fields){
            response(200, fields, 'deleteMahasiswa', res)
        }
    })
})

// NO 5
app.put('/updatemahasiswa/:id', (req, res)=> {
    const id_nih = req.params.id
    const { nim, nama_lengkap, kelas, alamat} = req.body
    const sql = `UPDATE mahasiswa SET nim = ${nim} , nama_lengkap = '${nama_lengkap}' , kelas = '${kelas}', alamat = '${alamat}' WHERE id = ${id_nih}`

    db.query(sql, (err, fields)=> {
        if(err) throw err
        if(fields){
            response(200, fields, 'updatemahasiswa', res)
        }
    })
})




app.delete('/mahasiswa', (req, res)=> {
    response(200, 'ini delete', res)
})

app.listen(port, ()=> {
    console.log(`Example app listening on port ${port}`)
})
