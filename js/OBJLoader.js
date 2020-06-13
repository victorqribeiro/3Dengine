class OBJLoader {

    static async loadObjModel(file, flip = true){

        const request = await fetch(`models/${file}.obj`)
        let data = await request.text()

        data = data.split('\n')

        const vertices = []
        const normals = []
        const uvs = []
        const finalVertices = []
        const finalUvs = []
        const finalNormals = []
        const finalIndices = []

        const cache = {}
        let index = 0
        let finalIndex = 0

        for(let line of data){

            if(line[0] == "#")
                continue

            line = line.split(' ')

            switch(line[0]){
                case "v":
                        vertices.push(parseFloat(line[1]),parseFloat(line[2]),parseFloat(line[3]))
                    break
                case "vt":
                        uvs.push(parseFloat(line[1]),parseFloat(line[2]))
                    break
                case "vn":
                        normals.push(parseFloat(line[1]),parseFloat(line[2]),parseFloat(line[3]))
                    break
                case "f":
                        line.shift()
                        let quad = false
                        for(let i = 0; i < line.length; i++){

                            if(i == 3 && !quad){
                                i = 2
                                quad = true
                            }

                            if(line[i] in cache){
                                finalIndices.push( cache[line[i]] )
							              }else{
                                const values = line[i].split('/')

                                index = (parseInt(values[0])-1) * 3
                                finalVertices.push(vertices[index], vertices[index+1], vertices[index+2])

                                index = (parseInt(values[1])-1) * 2
                                finalUvs.push( uvs[index], flip ? 1 - uvs[index+1] : uvs[index+1])

                                index = (parseInt(values[2])-1) * 3
                                finalNormals.push(normals[index], normals[index+1], normals[index+2])

                                cache[ line[i] ] = finalIndex
                                finalIndices.push(finalIndex++)
                            }
                            if(i == 3 && quad){
                                finalIndices.push( cache[line[0]] )
                            }
                        }
                    break
            }

        }

        return loader.loadToVAO(finalVertices, finalUvs, finalNormals, finalIndices)

	}
}
