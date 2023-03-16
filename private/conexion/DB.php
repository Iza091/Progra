<?php
class DB_Conexion{
    private $conexion, $result, $prepare;
    public function DB_Conexion ($server, $user, $pass){ 
        $this->conexion = new PDO($server,$user,$pass,
        array(PDO::ATTR_EMULATE_PREPARES=>false, 
        PDO::ATTR_ERRMODE=>PDO::ERRORMODE_EXCEPTION)) or die ('No se pudo conectar a la BD');
    }
    public function consultas($sql=''){
        try {
            $parametros= func_get_args(); //obtener la lista de parametros
            array_shift($parametros); // Quitamos el primer elemento porque es la consulta
            $this->prepare=$this->conexion->prepare($sql);
            $this->result= $this->prepare->execute($parametros);

        } catch (Exeption $e){
          return 'Error al ejecutar la consula'. $e->getMessage();  
        }
    }
    public function obtener_datos (){
        return $this->prepare->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtener($sql){
        try{
            return $this->conexion->query($sql);
            return $this->result;
        } catch (Exeption $e){
            return 'Error: '.$e->getMessage();
        }
        
    }
}
?>