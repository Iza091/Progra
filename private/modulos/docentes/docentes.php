<?php
include '../../config/config.php';
extract($_REQUEST);
$docente=isset($docente) ? $docente : '[]';
$accion= isset($acction) ? $accion:'';
$class_docentes= new Docente($conexion);

if ($accion=='consultar'){
    print_r(json_encode($class_docentes->consultar()));

} else {
    print_r($class_docentes->recbir_datos($docentes));
}


class Docente {
    private $datos=[], $db;
    public $respuesta = ['msg'=>'ok'];
    public function __construct($db=''){
        $this-> db=$db;
    }
    public function recbir_datos ($docente){
        $this->datos=json_decode($docente,true);
    }
    private function validar_datos(){
        if (empty($this->datos['idDocente'])){
            $this->respuesta['msg']= 'NO se ha especificado un ID';
           
        }
        if (empty($this->datos['codigo'])){
            $this->respuesta['msg']= 'Por favor ingrese código';
        }
        if (empty($this->datos['nombre'])){
            $this->respuesta['msg']= 'Por favor ingrese nombre';
        }
        
        return $this.administrar_docente();
    }
    private function administrar_docente(){
        global $accion;
        if( $this->respuesta['msg']=='ok' ){
                       if($accion=='nuevo'){
                                      $this->db->consultas(
                                                     'INSERT INTO docentes VALUES(?,?,?)',
                                                     $this->datos['idDocente'], $this->datos['codigo'], $this->datos['nombre']
                                      );

                       }else if($accion=='modificar'){
                                      return $this->db->consultas(
                                                     'UPDATE docentes SET codigo=?, nombre=? WHERE idDocente=?',
                                                     $this->datos['codigo'],datos['nombre'],datos['idDocente']
                                      );
                                      
                       }else if($accion=='eliminar'){
                                      return $this->db->consultas(
                                                     'DELETE docentes FROM docentes WHERE idDocente=?',
                                                     $this->datos['idDocente']
                                      );
                       }
        }else{
                       return $this->respuesta;
        }
    }

    public function consultar(){
        $this->db->consultas('SELECT * FROM docentes');
        return $this->db->obtener_datos();
    }
} 
?>