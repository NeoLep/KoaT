/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-06-16 14:34:48
 * @LastEditors: Leep
 * @LastEditTime: 2022-06-18 10:02:38
 */
import * as fs from "fs-extra"

export default class FileOperator {
  /** 
    * 创建目录
    * @param filePath 文件路径或者文件夹路径
  */
  public mkdir(filepath: String) {
    const arr = filepath.split('/');
    if(arr[0] === '') {
      arr.splice(0, 1)
      arr[0] = '/' + arr[0]
    }
    let directory = arr[0] 
    
    arr.forEach((item, index) => {
      if(index !== 0) directory = directory + '/' + item
      if(!fs.existsSync(directory)) fs.mkdirSync(directory);
    })
  }

  /** 
    * 目录与目录之间复制文件,两个参数要匹配,文件就是文件,文件夹就是文件夹
    * @param from 起始文件目录
    * @param to 目标文件目录
  */
  public copy(from: string, to: string) {
    const originFileIsDir = fs.lstatSync(from).isDirectory(); // 判断原型类型 true 为文件夹
    
    // 创建需要放置的文件夹
    if(!originFileIsDir) { 
      const toPath = to.split('/').slice(0, -1).join('/')
      this.mkdir(toPath); 
    } else {
      this.mkdir(to);
    }
    

    if(!originFileIsDir) {
      fs.createReadStream(from).pipe(fs.createWriteStream(to));
      // let readable=fs.createReadStream(_src);//创建读取流        
      // let writable=fs.createWriteStream(_dst);//创建写入流
      //fs.createReadStream(src).pipe(fs.createWriteStream(dst));大文件复制
    } else {
      const files = fs.readdirSync(from)
      files.forEach(item => {
        this.copy(`${from}/${item}`, `${to}/${item}`)
      })
    }
  }

  public travelPath(path: any): Array<String> {
    const files = fs.readdirSync(path)
    return files
  }

  public removeTarget(path: string): any {
      fs.removeSync(path)
  }

  public writeFile(path: string, data: any) {
    fs.writeFileSync(path, data);
  }
}