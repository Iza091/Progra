Vue.component('component-alumnos',{
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            alumnos: [],
            alumno:{
                idAlumno : '',
                codigo : '',
                nombre : '',
                fecha : '',
                direccion : '',
                municipio : '',
                departamento : '',
                telefono : '',
                dui : '',
                sexo : '',
            }
        }
    },
    methods:{
        guardarAlumno(){
            let store = this.abrirStore('tblalumnos', 'readwrite');
            if(this.accion==='nuevo'){
                this.alumno.idAlumno = new Date().getTime().toString(16);
            }
            store.put( JSON.parse(JSON.stringify(this.alumno) ) );
            this.listar();
            this.nuevoAlumno();
        },
        eliminarAlumno(alumno){
            if( confirm(`Esta seguro de eliminar a ${alumno.nombre}?`) ){
                let store = this.abrirStore('tblalumnos', 'readwrite'),
                    req = store.delete(alumno.idAlumno);
                req.onsuccess = resp=>{
                    this.listar();
                };
            }
        },
        nuevoAlumno(){
            this.accion = 'nuevo';
            this.alumno.idAlumno = '';
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.fecha = '';
            this.alumno.direccion = '';
            this.alumno.municipio = '';
            this.alumno.departamento = '';
            this.alumno.telefono = '';
            this.alumno.dui = '';
            this.alumno.sexo = '';
            
        },
        modificarAlumno(alumno){
            this.accion = 'modificar';
            this.alumno = alumno;
        },
        listar(){
            let store = this.abrirStore('tblalumnos', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.alumnos = data.result
                .filter(alumno=>alumno.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1||
                alumno.codigo.indexOf(this.buscar)>-1 ||
                alumno.nombre.indexOf(this.buscar)>-1
              );
            };
        },
        abrirStore(store, modo){
            let tx = this.db.transaction(store, modo); 
            return tx.objectStore(store);
        },
        abrirBD(){
            let indexDB = indexedDB.open('Sistema_Academico',1);
            indexDB.onupgradeneeded=e=>{
                let req = e.target.result,
                    tblalumno = req.createObjectStore('tblalumnos', {keyPath:'idAlumno'});
                    

                tblalumno.createIndex('idAlumno', 'idAlumno', {unique:true});
                
            };
            indexDB.onsuccess= e=>{
                this.db = e.target.result;
                this.listar();
            };
            indexDB.onerror= e=>{
                console.error( e );
            };
        },
    },
    created(){
        this.abrirBD();
    },



    template: `
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="card">
                    <div class="card-header bg-primary text-white text-center">REGISTRO DE ALUMNOS</div>
                    <div class="card-body">
                        <form id="frmAlumno" @reset.prevent="nuevoAlumno" v-on:submit.prevent="guardarAlumno">

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtCodigoAlumno">Código:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[US | SM]{2}[IS | LI]{2}[0-9]{6}" 
                                    placeholder="USIS200230" v-model="alumno.codigo" type="text" class="form-control" name="txtCodigoAlumno" id="txtCodigoAlumno">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtNombreAlumno">Nombre:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                    placeholder="Nombre"  v-model="alumno.nombre" type="text" class="form-control" name="txtNombreAlumno" id="txtNombreAlumno">
                                </div>
                            </div>
                

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtFechaAlumno">Fecha de Nacimiento:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required 
                                        v-model="alumno.fecha" type="date" class="form-control" name="txtFechaAlumno" id="txtFechaAlumno">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtDireccionAlumno">Dirección:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        placeholder="Dirección" v-model="alumno.direccion" type="text" class="form-control" name="txtDireccionAlumno" id="txtDireccionAlumno">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtMunicipioAlumno">Municipio:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                    placeholder="Municipio" v-model="alumno.municipio" type="text" class="form-control" name="txtMunicipioAlumno" id="txtMunicipioAlumno">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtNDepartamentoAlumno">Departamento:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                    placeholder="Departamento" v-model="alumno.departamento" type="text" class="form-control" name="txtNDepartamentoAlumno" id="txtNDepartamentoAlumno">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtTelefonoAlumno">Teléfono:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[0-9]{4}-[0-9]{4]"
                                    placeholder="1234-5678"  v-model="alumno.telefono" type="text" class="form-control" name="txtTelefonoAlumno" id="txtTelefonoAlumno">
                                </div>
                            </div>


                            <div class="row p-1">
                            <div class="col-3 col-md-4">
                                <label for="txtDuiAlumno">Dui:</label>
                            </div>
                            <div class="col-6 col-md-6">
                                <input required="[0-9]{8}-[0-9]{1}" 
                                placeholder="12345678-9" v-model="alumno.dui" type="text" class="form-control" name="txtDuiAlumno" id="txtDuiAlumno">
                            </div>
                        </div>


                            <div class="row p-1">
                            <div class="col-3 col-md-4">
                                <label for="txtSexoAlumno">Sexo:</label>
                            </div>
                            <div class="col-6 col-md-6">
                                <select  required                    
                                        v-model="alumno.sexo"  class="form-control" name="txtSexoAlumno" id="txtSexoAlumno">
                                        <option disabled value="">Seleccione género</option>
                                        <option>Masculino</option>
                                        <option>Femenino</option>
                                        <option>No binario</option>   
                                    </select> 
                            </div>
                        </div>



                            <div class="row p-1">
                                <div class="col-3 col-md-6">
                                    <input class="btn btn-primary" type="submit" 
                                        value="Guardar">
                                </div>
                                <div class="col-3 col-md-3">
                                    <input class="btn btn-warning" type="reset" value="Nuevo">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-10">
            
                <div class="card">
                    <div class="card-header bg-primary text-white text-center">LISTADO DE ALUMNOS</div>
                    <div class="card-body">
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>BUSCAR:</th>
                                    <th colspan="2"><input type="text" class="form-control" v-model="buscar"
                                        @keyup="listar()"
                                        placeholder="Buscar por código o nombre"></th>
                                </tr>
                                <tr>
                                    <th>CODIGO</th>
                                    <th>NOMBRE</th>
                                    <th>FECHA DE NACIMIENTO</th>
                                    <th>DIRECCION</th>
                                    <th>MUNICIPIO</th>
                                    <th>DEPARTAMENTO</th>
                                    <th>TELEFONO</th>
                                    <th>DUI</th>
                                    <th>SEXO</th>



                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="alumno in alumnos" :key="alumno.idAlumno" @click="modificarAlumno(alumno)" >
                                    <td>{{ alumno.codigo }}</td>
                                    <td>{{alumno.nombre}}</td>
                                    <td>{{ alumno.fecha }}</td>
                                    <td>{{ alumno.direccion }}</td>
                                    <td>{{ alumno.municipio }}</td>
                                    <td>{{ alumno.departamento }}</td>
                                    <td>{{ alumno.telefono }}</td>
                                    <td>{{ alumno.dui }}</td>
                                    <td>{{ alumno.sexo }}</td>

                                    <td><button class="btn btn-danger" @click="eliminarAlumno(alumno)">ELIMINAR</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
});