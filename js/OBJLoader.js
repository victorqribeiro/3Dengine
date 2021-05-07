class OBJLoader {

    static async loadObjModel(file, flip = true, bbox = false){

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

        let minX = Infinity
        let minY = Infinity
        let minZ = Infinity
        let maxX = -Infinity
        let maxY = -Infinity
        let maxZ = -Infinity

        const cache = {}
        let index = 0
        let finalIndex = 0

        for(let line of data){

            if(line[0] == "#")
                continue

            line = line.split(' ')

            switch(line[0]){
                case "v":
                        const x = parseFloat(line[1])
                        const y = parseFloat(line[2])
                        const z = parseFloat(line[3])
                        if( x < minX )
                            minX = x
                        if( x > maxX )
                            maxX = x
                        if( y < minY )
                            minY = y
                        if( y > maxY )
                            maxY = y
                        if( z < minZ )
                            minZ = z
                        if( z > maxZ )
                            maxZ = z
                        vertices.push(x,y,z)
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

        if(bbox){
            const a = 0, cosA = Math.cos(a), sinA = Math.sin(a)
            const minXcosA = minX * cosA
            const maxXcosA = maxX * cosA
            const minZcosA = minZ * cosA
            const maxZcosA = maxZ * cosA
            const minXsinA = minX * sinA
            const maxXsinA = maxX * sinA
            const minZsinA = minZ * sinA
            const maxZsinA = maxZ * sinA
            plane = loader.loadToVAOsimple([
                minXcosA - minZsinA, minY, minZcosA + minXsinA,
                minXcosA - minZsinA, maxY, minZcosA + minXsinA,
                
                maxXcosA - minZsinA, minY, minZcosA + maxXsinA,
                maxXcosA - minZsinA, maxY, minZcosA + maxXsinA,
                
                minXcosA - maxZsinA, minY, maxZcosA + minXsinA,
                minXcosA - maxZsinA, maxY, maxZcosA + minXsinA,
                
                maxXcosA - maxZsinA, minY, maxZcosA + maxXsinA,
                maxXcosA - maxZsinA, maxY, maxZcosA + maxXsinA,
                
                maxXcosA - maxZsinA, maxY, maxZcosA + maxXsinA,
                minXcosA - maxZsinA, maxY, maxZcosA + minXsinA,
                
                maxXcosA - maxZsinA, minY, maxZcosA + maxXsinA,
                minXcosA - maxZsinA, minY, maxZcosA + minXsinA,
                
                maxXcosA - minZsinA, maxY, minZcosA + maxXsinA,
                minXcosA - minZsinA, maxY, minZcosA + minXsinA,
                
                maxXcosA - minZsinA, minY, minZcosA + maxXsinA,
                minXcosA - minZsinA, minY, minZcosA + minXsinA,
                
                minXcosA - minZsinA, minY, minZcosA + minXsinA,
                minXcosA - maxZsinA, minY, maxZcosA + minXsinA,
                
                minXcosA - minZsinA, maxY, minZcosA + minXsinA,
                minXcosA - maxZsinA, maxY, maxZcosA + minXsinA,
                
                maxXcosA - minZsinA, maxY, minZcosA + maxXsinA,
                maxXcosA - maxZsinA, maxY, maxZcosA + maxXsinA,

                maxXcosA - minZsinA, minY, minZcosA + maxXsinA,
                maxXcosA - maxZsinA, minY, maxZcosA + maxXsinA 
                
        ], 3)
        }
        
        return loader.loadToVAO(finalVertices, finalUvs, finalNormals, finalIndices)

	}
}
