class Camera {

    constructor(position, rotation){
        this.position = position
        this.rotation = rotation
        this.speed = 0.2
    }

    move(){
        if(keys[87]){
            const a = glMatrix.toRadian(this.rotation.y+90)
            this.position.x -= Math.cos(a) * this.speed
            this.position.z -= Math.sin(a) * this.speed
        }else if(keys[83]){
            const a = glMatrix.toRadian(this.rotation.y+90)
            this.position.x += Math.cos(a) * this.speed
            this.position.z += Math.sin(a) * this.speed
        }

        if(keys[65]){
            const a = glMatrix.toRadian(this.rotation.y)
            this.position.x -= Math.cos(a) * this.speed
            this.position.z -= Math.sin(a) * this.speed
        }else if(keys[68]){
            const a = glMatrix.toRadian(this.rotation.y)
            this.position.x += Math.cos(a) * this.speed
            this.position.z += Math.sin(a) * this.speed
        }

        if(keys[38]){
            this.position.y += this.speed
        }else if(keys[40]){
            if(this.position.y > 1)
              this.position.y -= this.speed
        }

        if(keys[37])
            this.rotation.y -= 1
        else if(keys[39])
            this.rotation.y += 1
    }

}
