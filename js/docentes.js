Vue.component('component-docentes',{
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            docentes: [],
            docente:{
                idDocente   : '',
                codigo      : '',
                nombre      : '',
                fecha       : '',
                direccion   : '',
                municipio   : '',
                departamento: '',
                telefono    : '',
                dui         : '',
                sexo        : '',
            }
        }
    },
    methods:{
        guardarDocente(){
            if( this.docente.nombre=='' || 
                this.docente.codigo=='' ){
                console.log( 'Por favor ingrese los datos correspondientes' );
                return;
            }
            let store = abrirStore("tbldocentes", 'readwrite');
            if( this.accion==='nuevo' ){
                this.docente.idDocente = new Date().getTime().toString(16);//las cantidad milisegundos y lo convierte en hexadecimal   
            }
            let query = store.put( JSON.parse( JSON.stringify(this.docente) ));
            query.onsuccess = resp=>{
                fetch(`private/modulos/docentes/docentes.php?docente=$JSON.stringify(this.docente)`)
                .then(resp=>resp.json())
                .then(resp=>{
                    console.log(resp);
                });
                this.nuevoDocente();
                this.listar();
            };
            query.onerror = err=>{
                console.error('ERROR al guardar docente', err);
            };
        },
        eliminarDocente(docente){
            if( confirm(`Esta seguro de eliminar el docente ${docente.nombre}?`) ){
                let store = abrirStore('tbldocentes', 'readwrite'),
                    req = store.delete(docente.idDocente);
                req.onsuccess = res=>{
                    this.listar();
                };
                req.onerror = err=>{
                    console.error('ERROR al guardar docente');
                };
            }
        },
        nuevoDocente(){
            this.accion = 'nuevo';
            this.docente.idDocente = '';
            this.docente.codigo = '';
            this.docente.nombre = '';
            this.docente.fecha = '';
            this.docente.municipio = '';
            this.docente.direccion = '';
            this.docente.departamento = '';
            this.docente.telefono = '';
            this.docente.dui = '';
            this.docente.sexo = '';
            
        },
        modificarDocente(docente){
            this.accion = 'modificar';
            this.docente = docente;
        },
        listar(){
            let store = this.abrirStore('tbldocentes', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.docentes = data.result
                .filter(docente=>docente.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1||
                docente.codigo.indexOf(this.buscar)>-1 ||
                docente.nombre.indexOf(this.buscar)>-1
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
                    tbldocente = req.createObjectStore('tbldocentes', {keyPath:'idDocente'});
                    

                tbldocente.createIndex('idDocente', 'idDocente', {unique:true});
                
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
                    <div class="card-header bg-dark text-white text-center">REGISTRO DE DOCENTE</div>
                    <div class="card-body">
                        <form id="frmDocente" @reset.prevent="nuevoDocente" v-on:submit.prevent="guardarDocente">

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtCodigoDocente">Código:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[0-9]{3}" 
                                        title="Ingrese un codigo de docente de 3 digitos"
                                           placeholder="123" v-model="docente.codigo" type="text" class="form-control" name="txtCodigoDocente" id="txtCodigoDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtNombreDocente">Nombre:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        placeholder="Nombre" v-model="docente.nombre" type="text" class="form-control" name="txtNombreDocente" id="txtNombreDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtFechaDocente">Fecha de Nacimiento:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required 
                                        v-model="docente.fecha" type="date" class="form-control" name="txtFechaDocente" id="txtFechaDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtDireccionDocente">Dirección:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                     placeholder="Dirección"  v-model="docente.direccion" type="text" class="form-control" name="txtDireccionDocente" id="txtDireccionDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtMunicipioDocente">Municipio:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                        placeholder="Municipio" v-model="docente.municipio" type="text" class="form-control" name="txtMunicipioDocente" id="txtMunicipioDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtNDepartamentoDocente">Departamento:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[A-Za-zÑñáéíóú ]{3,75}"
                                     placeholder="Departamento" v-model="docente.departamento" type="text" class="form-control" name="txtNDepartamentoDocente" id="txtNDepartamentoDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtTelefonoDocente">Telefono:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[0-9]{4}-[0-9]{4]"
                                     placeholder="1234-5678" v-model="docente.telefono" type="text" class="form-control" name="txtTelefonoDocente" id="txtTelefonoDocente">
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtDuiDocente">DUI:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                    <input required pattern="[0-9]{8}-[0-9]{1}"
                                     placeholder="12345678-9"  v-model="docente.dui" type="text" class="form-control" name="txtDuiDocente" id="txtDuiDocente">
                                </div>
                            </div>

                            <div class="row p-1">
                            <div class="col-3 col-md-4">
                                <label for="txtSexoDocente">Sexo:</label>
                            </div>
                            <div class="col-6 col-md-6">
                                <select  required           
                                        v-model="docente.sexo"  class="form-control" name="txtSexoDocente" id="txtSexoDocente">
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
                    <div class="card-header bg-dark text-white text-center">LISTADO DE DOCENTES</div>
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
                                <tr v-for="docente in docentes" :key="docente.idDocente" @click="modificarDocente(docente)" >
                                    <td>{{ docente.codigo }}</td>
                                    <td>{{ docente.nombre }}</td>
                                    <td>{{ docente.fecha }}</td>
                                    <td>{{ docente.direccion }}</td>
                                    <td>{{ docente.municipio }}</td>
                                    <td>{{ docente.departamento }}</td>
                                    <td>{{ docente.telefono }}</td>
                                    <td>{{ docente.dui }}</td>
                                    <td>{{ docente.sexo }}</td>

                                    <td><button class="btn btn-danger" @click="eliminarDocente(docente)">ELIMINAR</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
});
