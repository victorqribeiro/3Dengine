class Entity {

    constructor(texturedModel, position, rotation, scale){
        this.texturedModel = texturedModel
        this.position = position
        this.rotation = rotation
        this.scale = scale
    }

    increasePosition(dx, dy, dz){
        this.position.x += dx
        this.position.y += dy
        this.position.z += dz
    }

    increaseRotation(dx, dy, dz){
        this.rotation.x += dx
        this.rotation.y += dy
        this.rotation.z += dz
    }

    increaseScale(dx, dy, dz){
        this.scale.x += dx
        this.scale.y += dy
        this.scale.z += dz
    }

}
