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
    
    static barryCentric(p1, p2, p3, pos) {
		const det = (p2.z - p3.z) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.z - p3.z)
		const l1 = ((p2.z - p3.z) * (pos.x - p3.x) + (p3.x - p2.x) * (pos.y - p3.z)) / det
		const l2 = ((p3.z - p1.z) * (pos.x - p3.x) + (p1.x - p3.x) * (pos.y - p3.z)) / det
		const l3 = 1 - l1 - l2
		return l1 * p1.y + l2 * p2.y + l3 * p3.y
	}
}
