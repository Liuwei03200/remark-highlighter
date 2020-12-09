<template>
    <div >
        <el-card class="maininfo">
            <el-main class="main">
                <div class="title">{{title}}</div>
                <div  ref='target' class="target" v-html="en_html"></div>   
                <div>
                    <el-button type="primary" @click="onHighlighter()">
                        <span style="color:#fff;">备注</span> 
                    </el-button>
                </div>
            </el-main>           
        </el-card>
    </div> 
</template>
<script>
import Highlighter from 'web-highlighter';
export default {
    name:'article',
    data() { 
        return {
            highlighter:null,
            nowsourcesArr:[],
        }
    },
    props:['title','en_html',"bzlist","sourcesArr"],
    mounted() {
         // 1. 初始化数据
        this.highlighter = new Highlighter({
            $root:this.$refs.target,
            wrapTag: 'i',
            exceptSelectors: ['.my-remove-tip', 'pre', 'code'],
            style:{
                //添加classname
                className:'highlight-wrap',
            }
        });

        // console.log( this.highlighter);

        // 3. 监听高亮笔记创建事件，并将信息存至后端
        this.highlighter
        .on(Highlighter.event.CLICK, ({id}) => {
            console.log('click -', id);
            // console.log(this.bzlist);
            this.chooseShow(id);
            
        })
        .on(Highlighter.event.HOVER, ({id}) => {
            console.log('hover -', id);
            this.highlighter.addClass('highlight-wrap-hover', id); 
        })
        .on(Highlighter.event.HOVER_OUT, ({id}) => {
            console.log('hover out -', id);
            this.highlighter.removeClass('highlight-wrap-hover', id);
        })
        .on(Highlighter.event.CREATE, ({sources}) => {
            console.log('create -', sources);
            // console.log(sources);    
            this.nowsourcesArr.push(sources[0]);
            
            let id =sources[0].id;
            let offset = sources[0].startMeta.textOffset;
            console.log(offset);
            if(this.bzlist.length!=0){
                for (const value of this.bzlist) {
                    if(value.id == id){ 
                    }else{
                        let obj ={
                            id:id,
                            info:'',
                            offset : offset,
                            tag:'success'
                        }; 
                        this.$emit('addBzlist',obj);
                        break;
                    }
                }
            }else{
                let obj ={
                    id:id, 
                    offset : offset,
                    info:'',
                    tag:'success'
                }; 
                this.$emit('addBzlist',obj);
            }
            // this.en_html = this.$refs.task.innerHTML;  
        })  
        .on(Highlighter.event.REMOVE, ({ids}) => {
            console.log('remove -', ids);
            ids.forEach(id => {
            for (const key in this.nowsourcesArr) {
                if( this.nowsourcesArr[key].id == id){
                    this.nowsourcesArr.splice(key,1);
                }
            }
            for (const key in this.bzlist) {
                if(this.bzlist[key].id == id){ 
                    this.bzlist.splice(key,1);
                }
            }
            });
        });

        // 2. 从后端获取高亮信息，还原至网页
        // getRemoteData().then(s => highlighter.fromStore(s.startMeta, s.endMeta, s.id, s.text));
        //  if(this.sourcesArr!=[]){
        // highlighter.fromStore(this.sourcesArr.startMeta, this.sourcesArr.endMeta, this.sourcesArr.id, this.sourcesArr.text);
        // }
        this.sourcesArr.forEach(
            (hs) =>  this.highlighter.fromStore(hs.startMeta, hs.endMeta, hs.text, hs.id, hs.extra)
        );

        // 4. 开启自动划词高亮
        // this.highlighter.run();
        // this.highlighter.run();

        document.addEventListener('click', e => {
            const $ele = e.target;
            // 删除 删除按钮
            if ($ele.classList.contains('my-remove-tip')) {
                const id = $ele.dataset.id;
                console.log('*click remove-tip*', id);
                $ele.parentNode.removeChild($ele);
                this.highlighter.removeClass('highlight-wrap-hover', id);
                this.highlighter.remove(id);
            } 
        });
    }, 
    methods: {
        onHighlighter(){
            const selection = window.getSelection();
            // if (selection.isCollapsed) {
            //   console.log(1)
            //     return;
            // } 
            this.highlighter.fromRange(selection.getRangeAt(0));
            window.getSelection().removeAllRanges();  
        },
        chooseShow(id){
            console.log(id);
            this.$emit('editBzShowID',id);
            setTimeout(()=>{
                this.highlighter.addClass('highlight-wrap-hover', id); 
            },20)
        },
        deleteBz(id){ 
            this.highlighter.removeClass('highlight-wrap-hover', id);
            this.highlighter.remove(id);
        },
        addClass(id){
            this.highlighter.addClass('highlight-wrap-hover', id); 
        },
        removeClass(id){
            this.highlighter.removeClass('highlight-wrap-hover', id);
        } 
    },
}
</script>
<style>
*{
    font-family: Verdana, Arial, Helvetica, sans-serif;
    font-size: 15px;
    color:#000;
}
.maininfo{
    height: 550px;
    padding: 0px 0 25px;
}
.main{
    max-height: 550px;
    overflow: scroll;
}
.title{
    font-weight: 700;
    margin: 20px;
}
.target{
  padding: 0px 15px 50px;
  line-height: 250%;
  text-align: left;
  text-indent: 20px;
}
.highlight-wrap-hover {
    background: rgb(255, 231, 194) !important;;
}
.highlight-wrap {
    color: rgb(255, 161, 61);
    text-decoration: underline;
    /* background: #ff9; */
    cursor: pointer;
}
.my-remove-tip {
    box-sizing: border-box;
    position: absolute;
    border: 1px solid #fff;
    border-radius: 3px;
    height: 20px;
    width: 40px;
    color: #fff;
    background: #444;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
    line-height: 18px;
    overflow: visible;
}

.my-remove-tip::after {
    content: '';
    position: absolute;
    left: 16px;
    bottom: -4px;
    border-color: #444 transparent transparent;
    border-width: 4px 4px 0;
    border-style: solid;
    height: 0;
    width: 0;
}
</style>>
    