class ModelTexture {

    constructor(texture, hasTransparency = false, useFakeLight = false){
        this.id = texture.id
        this.texture = texture.texture
        this.hasTransparency = hasTransparency
        this.useFakeLight = useFakeLight
        this.shineDamper = 10
        this.reflectivity = 0
    }

}
