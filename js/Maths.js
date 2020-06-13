class Maths {

    static createTransformMatrix(position, rotation, scale){
        const matrix = mat4.create()
        mat4.translate(matrix, matrix, [position.x,position.y,position.z])
        mat4.rotate(matrix, matrix, glMatrix.toRadian(rotation.x), [1,0,0])
        mat4.rotate(matrix, matrix, glMatrix.toRadian(rotation.y), [0,1,0])
        mat4.rotate(matrix, matrix, glMatrix.toRadian(rotation.z), [0,0,1])
        mat4.scale(matrix, matrix, [scale.x,scale.y,scale.x])
        return matrix
    }

    static createViewMatrix(camera){
        const matrix = mat4.create()
        mat4.rotate(matrix, matrix, glMatrix.toRadian(camera.rotation.x), [1,0,0])
        mat4.rotate(matrix, matrix, glMatrix.toRadian(camera.rotation.y), [0,1,0])
        mat4.translate(matrix, matrix, [-camera.position.x,-camera.position.y,-camera.position.z])
        return matrix
    }
}
