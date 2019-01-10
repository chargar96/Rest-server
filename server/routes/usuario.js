const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt-nodejs');
const _ = require('underscore');

const app = express();

app.get('/usuario', function (req, res) {

    let skip = req.query.skip || 0;
    skip = Number(skip);

    let limit = req.query.limit || 5;
    limit = Number(skip);

    Usuario.find({ estado:true }, 'nombre').skip(skip).limit(5)
            .exec( (err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok:false,
                        err
                    });
                }
                
                Usuario.count({estado:true}, (err, conteo) =>{
                    
                    res.json({
                        ok: true,
                        usuarios,
                        conteo
                    });
                    
                })
                
            })

  });
  
  app.post('/usuario', function (req, res) {
      
      let body = req.body;

      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(body.password, salt);

      let usuario = new Usuario({
          nombre: body.nombre,
          email: body.email,
          password: hash,
          role: body.role
      });

      usuario.save( (err, usuarioDB) =>{
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //usuarioDB.password = null;

            res.json({
                ok: true,
                usuario: usuarioDB
            })
      });
  
      
  });
  app.put('/usuario/:id', function (req, res) {

      let id = req.params.id;
      let body = _.pick(req.body, 
        ['nombre', 'email', 'img', 'role', 'estado']
        );

      Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) =>{
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
      })
  });
  app.delete('/usuario/:id', function(req, res){
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, {estado: false}, {new: true},(err, usuarioBorrado) =>{
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se puede borrar un usuario que no existe en la base de datos, CABEZON!!'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
      })
    })

  
  module.exports = app;