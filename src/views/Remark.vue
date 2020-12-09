<template>
  <div class="demoo">
     <el-container>
        <el-container>
          <el-card :body-style="{ padding: '0 5vw' }">
            <el-header style="margin-top: 10px;">
                 <div>
                    <el-radio v-model="auto" label="on">自动高亮</el-radio>
                    <el-radio v-model="auto" label="off">手动高亮</el-radio>
                  </div>
                  <div>
                    <el-button type="primary" size="small" :disabled="auto=='on'?true:false" @click="manuallyHighlight">高亮</el-button>
                  </div>
            </el-header>
            <el-main v-loading="load">
              <div ref='task' v-html="en_html"  class="task">
              </div>  
            </el-main>
          </el-card>
        </el-container>
        <el-aside width="400px">
          <el-card >
            <div slot="header">
              <span>备注</span>
            </div>
            <!-- card body -->
            <div>
              <div class="asidediv" v-for="(v,n) in bzlistSort" :key="v.id" @click="chooseShow(v.id)">
                <el-input type="textarea" v-model="v.info" placeholder="点击可快速定位" :disabled="bzEditN==n?false:true" @blur="bzEditN = -1" :ref="v.id"></el-input>
                <div style="margin-top:10px" v-if="bzshowID==v.id">
                  <el-button type="success" @click="editBz(n,v.id)">编辑</el-button>
                  <el-button type="delete" @click="deleteBz(v.id)">删除</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-aside>
    </el-container>
  </div>
</template>

<script>
import Highlighter from 'web-highlighter';

export default {
  name: 'Demoo',
  data() {
    return {
      highlighter:null,
      auto:'on',
      load:false,
      en_html:`For this reason, the repo (web-highlighter) aims to help you implement highlighting-note on any website
            quickly (e.g. blogs, document viewers, online books and so on). It contains the core abilities for note
            highlighting and persistence. And you can implement your own product by some easy-to-use APIs. It has been
            used for our sites in production.<br>
            If you have ever visited medium.com, you must know the feature of highlighting notes: users select a text segment and click the 'highlight' button. Then the text will be highlighted with a shining background color. Besides, the highlighted areas will be saved and recovered when you visit it next time. It's like the simple demo bellow.`,
      sourcesArr:[
        {"startMeta":{"parentTagName":"DIV","parentIndex":-2,"textOffset":281},"endMeta":{"parentTagName":"DIV","parentIndex":-2,"textOffset":301},"text":"nt your own product ","id":"32801383-cdad-475e-831f-30a89be9f77b","__isHighlightSource":{}},
        {"startMeta":{"parentTagName":"DIV","parentIndex":-2,"textOffset":335},"endMeta":{"parentTagName":"DIV","parentIndex":-2,"textOffset":492},"text":"een\n            used for our sites in production.\n            If you have ever visited medium.com, you must know the feature of highlighting notes: users sel","id":"f907faac-7427-4510-9143-dc1134802c7b","__isHighlightSource":{}},
        {"startMeta":{"parentTagName":"DIV","parentIndex":-2,"textOffset":481},"endMeta":{"parentTagName":"DIV","parentIndex":-2,"textOffset":656},"text":": users select a text segment and click the 'highlight' button. Then the text will be highlighted with a shining background color. Besides, the highlighted areas will be saved","id":"00dd3c26-1c2f-40e4-acdb-1c5cb109cc20","__isHighlightSource":{}}
      ],
      nowsourcesArr:[],
      bzlist:[
        {
          id:'32801383-cdad-475e-831f-30a89be9f77b',
          offset:281,
          info:'aaaaaaaaaaaaa',
          tag:'success'
        }
      ],
      bzEditN:-1,
      bzshowID:0,
    }
  },
   watch:{
    'auto': function(newVal){
          this.switchAuto(newVal);
    },
    'bzshowID':function(newVal,oldVal){
      if(oldVal!=0){
        this.highlighter.removeClass('highlight-wrap-hover', oldVal);
      }
    }
  },
  computed: {
    bzlistSort:function(){
      let arr = [];
      arr = this.bzlist.sort((a,b)=>{
        if(a.offset > b.offset){
          return 1
        }else if (a.offset < b.offset){
          return -1
        }else{
          return 0
        }
      });
      console.log(arr);
      return arr;
    }
  },
  mounted() {
     // 1. 初始化数据
    this.highlighter = new Highlighter({
      $root:this.$refs.task,
      wrapTag: 'i',
      exceptSelectors: ['.my-remove-tip', 'pre', 'code'],
      style:{
        //添加classname
        className:'highlight-wrap',
      }
    });

    console.log( this.highlighter);


    // 3. 监听高亮笔记创建事件，并将信息存至后端
     this.highlighter
      .on(Highlighter.event.CLICK, ({id}) => {
          console.log('click -', id);
          console.log(this.bzlist);
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
        console.log(sources);

        // 制造删除按钮
        // sources.forEach(s => {
        //     const position = this.getPosition( this.highlighter.getDoms(s.id)[0]);
        //     this.createTag(position.top, position.left, s.id);
        // }); 
 
        this.nowsourcesArr.push(sources[0]);
        
        let id =sources[0].id;
        let offset = sources[0].startMeta.textOffset;
        console.log(offset);
        if(this.bzlist.length!=0){
          for (const value of this.bzlist) {
            if(value.id == id){
            }else{
              this.bzlist.push({
                id:id,
                info:'',
                offset : offset,
                tag:'success'
              });
              break;
            }
          }
        }else{
          this.bzlist.push({
            id:id, 
            offset : offset,
            info:'',
            tag:'success'
          });
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

    /**
     * avoid re-highlighting the existing selection
     */
    // highlighter.hooks.Render.SelectedNodes.tap((id, selectedNodes) => {
    //     selectedNodes = selectedNodes.filter(n => n.$node.textContent);
    //     if (selectedNodes.length === 0) {
    //         return [];
    //     }
    //     const candidates = selectedNodes.slice(1).reduce(
    //         (left, selected) => getIntersection(left, this.getIds(selected)),
    //         this.getIds(selectedNodes[0])
    //     );
    //     for (let i = 0; i < candidates.length; i++) {
    //         if (highlighter.getDoms(candidates[i]).length === selectedNodes.length) {
    //             return [];
    //         }
    //     }
    //     return selectedNodes;
    // });

    
    // highlighter.hooks.Serialize.Restore.tap(
    //     source =>  log('Serialize.Restore hook -', source)
    // );
    // highlighter.hooks.Serialize.RecordInfo.tap(() => {
    //     const extraInfo = Math.random().toFixed(4);
    //     console.log('Serialize.RecordInfo hook -', extraInfo)
    //     return extraInfo;
    // });


     // 2. 从后端获取高亮信息，还原至网页
    // getRemoteData().then(s => highlighter.fromStore(s.startMeta, s.endMeta, s.id, s.text));
    //  if(this.sourcesArr!=[]){
      // highlighter.fromStore(this.sourcesArr.startMeta, this.sourcesArr.endMeta, this.sourcesArr.id, this.sourcesArr.text);
    // }
    this.sourcesArr.forEach(
        (hs) =>  this.highlighter.fromStore(hs.startMeta, hs.endMeta, hs.text, hs.id, hs.extra)
    );

    // 4. 开启自动划词高亮
    // let autoStatus;
    // document.querySelectorAll('[name="auto"]').forEach($n => {
    //     if ($n.checked) {
    //         autoStatus = $n.value;
    //     }
    // });
    // this.switchAuto(autoStatus);
    this.switchAuto(this.auto);
    // highlighter.run();


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
        // toggle auto highlighting switch
        // else if ($ele.getAttribute('name') === 'auto') {
        //     const val = $ele.value;
        //     if (autoStatus !== val) {
        //         this.switchAuto(val);
        //         autoStatus = val;
        //     } 
        // } 
        // highlight range manually
        // else if ($ele.id === 'js-highlight') {
        //     const selection = window.getSelection();
        //     if (selection.isCollapsed) {
        //         return;
        //     }
        //     highlighter.fromRange(selection.getRangeAt(0));
        //     window.getSelection().removeAllRanges(); 
        // }
    });

    // let hoveredTipId;
    // document.addEventListener('mouseover', e => {
    //     const $ele = e.target;
    //     // toggle highlight hover state
    //     if ($ele.classList.contains('my-remove-tip') && hoveredTipId !== $ele.dataset.id) {
    //         hoveredTipId = $ele.dataset.id;
    //         highlighter.removeClass('highlight-wrap-hover');
    //         highlighter.addClass('highlight-wrap-hover', hoveredTipId);
    //     }
    //     else if (!$ele.classList.contains('my-remove-tip') && !$ele.classList.contains('highlight-mengshou-wrap')) {
    //         highlighter.removeClass('highlight-wrap-hover', hoveredTipId);
    //         hoveredTipId = null;
    //     }
    // });
  },
  methods: {
    chooseShow(id){
      console.log(id);
      this.bzshowID = id;
      setTimeout(()=>{
        this.highlighter.addClass('highlight-wrap-hover', id); 
      },20)
    },
    deleteBz(id){ 
      this.highlighter.removeClass('highlight-wrap-hover', id);
      this.highlighter.remove(id);
    },
    editBz(n,id){
      this.bzEditN=n;
      setTimeout(()=>{
        this.$refs[id][0].focus();
      },10)
    },
    switchAuto(auto){
        auto === 'on' ?  this.highlighter.run() :  this.highlighter.stop();
        // const $btn = document.getElementById('js-highlight');
        // if (auto === 'on') {
        //     $btn.classList.add('disabled');
        //     $btn.setAttribute('disabled', true);
        // }
        // else {
        //     $btn.classList.remove('disabled');
        //     $btn.removeAttribute('disabled');
        // }
    },
    manuallyHighlight(){
      const selection = window.getSelection();
      // if (selection.isCollapsed) {
      //   console.log(1)
      //     return;
      // } 
      this.highlighter.fromRange(selection.getRangeAt(0));
      window.getSelection().removeAllRanges();  
    },
    getPosition($node) {
        let offset = {
            top: 0,
            left: 0
        };
        while ($node) {
            offset.top += $node.offsetTop;
            offset.left += $node.offsetLeft;
            $node = $node.offsetParent;
        }
        return offset;
    },
    createTag(top, left, id){
        const $span = document.createElement('span');
        $span.style.left = `${left - 20}px`;
        $span.style.top = `${top - 25}px`;
        $span.dataset['id'] = id;
        $span.textContent = '删除'; 
        $span.classList.add('my-remove-tip');
        document.body.appendChild($span);
    },
    getIntersection(arrA, arrB){
        const record = {};
        const intersection = [];
        arrA.forEach(i => record[i] = true);
        arrB.forEach(i => record[i] && intersection.push(i) && (record[i] = false));
        return intersection;
    },
    getIds(selected) {
      if (!selected || !selected.$node || !selected.$node.parentNode) {
          return [];
      }
      return [
           this.highlighter.getIdByDom(selected.$node.parentNode),
          ...(this.highlighter).getExtraIdByDom(selected.$node.parentNode)
      ].filter(i => i)
    }

  }, 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.task{
  padding: 50px 100px;
  text-align: justify;
  text-indent: 20px;
  line-height: 180%;
}
.highlight-wrap-hover {
    background: #f7aaaa !important;;
}
.highlight-wrap {
    background: #ff9;
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
.asidediv{
  padding: 15px;
  border: 1px solid #111111;
  border-radius: 10px;
}
</style>
