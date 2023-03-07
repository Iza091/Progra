Vue.component('v-select-alumnos', VueSelect.VueSelect);
Vue.component('v-select-materias', VueSelect.VueSelect);

Vue.component('component-inscripciones',{
    data() {
        return {
            accion:'nuevo',
            buscar: '',
            matriculas:[],
            alumnos:[],
            materias:[],
            inscripciones: [],
            inscripcion:{
                idInscripcion : '',
                nombre:'',
                materia   : {
                    id    : '',
                    label : ''
                },
                alumno    : {
                    id    : '',
                    label : ''
                },
            }
        }
    },
    methods:{
        guardarInscripcion(){
            let store = this.abrirStore('tblinscritos', 'readwrite');
            if(this.accion==='nuevo'){
                this.inscripcion.idInscripcion = new Date().getTime().toString(16);
            }
            store.put( JSON.parse(JSON.stringify(this.inscripcion) ) );
            this.listar();
            this.nuevoInscripcion();
        },
        eliminarInscripcion(inscripcion){
            if( confirm(`Esta seguro de eliminar a ${inscripcion.nombre}?`) ){
                let store = this.abrirStore('tblinscritos', 'readwrite'),
                    req = store.delete(inscripcion.idInscripcion);
                req.onsuccess = resp=>{
                    this.listar();
                };
            }
        },
        nuevoInscripcion(){
            this.accion = 'nuevo';
            this.inscripcion.idInscripcion = '';
            this.inscripcion.materia.id = '';
            this.inscripcion.materia.label = '';
            this.inscripcion.alumno.id = '';
            this.inscripcion.alumno.label = '';
            
        },
        modificarInscripcion(inscripcion){
            this.accion = 'modificar';
            this.inscripcion = inscripcion;
        },
        listar(){
            let store = this.abrirStore('tblinscritos', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.inscripciones = data.result
                .filter(inscripcion=>inscripcion.materia.toLowerCase().indexOf(this.buscar.toLowerCase())>-1);
            };
        },
        listarAlumnos(){
            let store = this.abrirStore('tblmatricula', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.matriculas = data.result
                
            };
        },
        listarMateria(){
            let store = this.abrirStore('tblmaterias', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.materias = data.result
                
            };
            this.inscripcion = JSON.parse( localStorage.getItem('inscripcion') || "[]" )
            .filter(inscripcion=>inscripcion.alumno.label.toLowerCase().indexOf(this.buscar.toLowerCase())>-1);
            this.materias = JSON.parse( localStorage.getItem('materias') || "[]" ).map(materia=>{
                return { 
                    id: materia.idMateria,
                    label : materia.nombre
                }
            },
            this.alumnos = JSON.parse( localStorage.getItem('alumnos') || "[]" ).map(alumno=>{
            return { 
                id: alumno.idAlumno,
                label : alumno.nombre
            }
            }));

        },
        abrirStore(store, modo){
            // let tx = this.db.transaction(store, modo); 
            // return tx.objectStore(store);
        },
        abrirBD(){
            let indexDB = indexedDB.open('Sistema_Academico',1);
            indexDB.onupgradeneeded=e=>{
                let req = e.target.result,
                    tblalumno = req.createObjectStore('tblinscritos', {keyPath:'idInscripcion'});
                    

                tblalumno.createIndex('idInscripcion', 'idInscripcion', {unique:true});
          
                
            };
            indexDB.onsuccess= e=>{
                this.db = e.target.result;
                this.listar();
                this.listarAlumnos();
                this.listarMateria();
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
                    <div class="card-header text-center bg-danger text-white ">INSCRIPCION DE ALUMNOS</div>
                    <div class="card-body">
                        <form id="frmInscripcion" @reset.prevent="nuevoInscripcion" v-on:submit.prevent="guardarInscripcion">

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtCodigoInscripcion">Alumnos Matriculados:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                <v-select-alumnos required v-model="inscripcion.alumno" :options="alumnos" ></v-select-alumnos>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-4">
                                    <label for="txtMateria">Materia para Inscribir:</label>
                                </div>
                                <div class="col-6 col-md-6">
                                <v-select-materias required v-model="inscripcion.materia" :options="materias" ></v-select-materias>
                                </div>
                            </div>


                            <div class="row p-1">
                                <div class="col-3 col-md-3">
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

            <div class="col-12 col-md-6">
                <div class="card">
                    <div class="card-header bg-primary text-center text-white">ALUMNOS INSCRITOS</div>
                    <div class="card-body">
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>BUSCAR:</th>
                                    <th colspan="2"><input type="text" class="form-control" v-model="buscar"
                                        @keyup="listar()"
                                        placeholder="Buscar por nombre o nombre"></th>
                                </tr>
                                <tr>
                                    <th>CODIGO</th>
                                    <th>MATERIA</th>


                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="inscripcion in inscripciones" :key="inscripcion.idInscripcion" @click="modificarInscripcion(inscripcion)" >
                            <td>{{ inscripcion.alumno.label }}</td>
                            <td>{{ inscripcion.materia.label }}</td>
                            <td><button class="btn btn-danger" @click="eliminarInscripcion(inscripcion)">ELIMINAR</button></td>
                        </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
});