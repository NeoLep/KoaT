/*
 * @description: 
 * @param: 
 * @return: 
 * @author: Leep
 * @Date: 2022-06-15 15:13:34
 * @LastEditors: Leep
 * @LastEditTime: 2022-06-20 09:56:31
 */
import * as Path from 'path';
import * as fs from 'fs-extra';

export default class ModuleManage {
  public modulePath = Path.resolve(`${__dirname}`, '../module/');

  buildModuleTree(): Array<Object> {
    return [{}]
  }

  compareVersion(version1: String, version2: String): number {
    const newVersion1 = `${version1}`.split('.').length < 3 ? `${version1}`.concat('.0') : `${version1}`;
    const newVersion2 = `${version2}`.split('.').length < 3 ? `${version2}`.concat('.0') : `${version2}`;
    //计算版本号大小,转化大小
    function toNum(a: string){
        const c = a.toString().split('.');
        const num_place = ["", "0", "00", "000", "0000"],
            r = num_place.reverse();
        for (let i = 0; i < c.length; i++){
            const len=c[i].length;
            c[i]=r[len]+c[i];
        }
        return c.join('');
    }

    //检测版本号是否需要更新
    function checkPlugin(a: string, b: string) {
        const numA = toNum(a);
        const numB = toNum(b);
        return numA > numB ? 1 : numA < numB ? -1 : 0;
    }
    return checkPlugin(newVersion1 ,newVersion2);
  }
}