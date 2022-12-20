import _ from 'lodash'
const files = import.meta.globEager('./**/index.vue')
const compList = {};
Object.keys(files).forEach(key => {
    const nameArr = key.split('/');
    compList[_.nth(nameArr, -2)] = files[key].default
})
export default compList
