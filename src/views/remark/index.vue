<template>
  <div class="ArticleComment">
    <br>
     <el-container>
        <el-container>
          <Article :title="title" :en_html="en_html" :bzlist="bzlist" :sourcesArr="sourcesArr" @addBzlist="addBzlist" @editBzShowID="editBzShowID" ref="articleRef" />
        </el-container>
        <el-aside width="400px"> 
          <el-tabs type="border-card" style="height: 99%;">
            <el-tab-pane label="原文点评" >
							<Comment @deleteBz="deleteBzID" @chooseShow="chooseShow" :bzlistSort="bzlistSort" :bzshowID="bzshowID" :tagList="tagList"/>
						</el-tab-pane>
          </el-tabs>
        </el-aside> 
    </el-container>
  </div>
</template>

<script>
import Article from './components/Article'
import Comment from './components/Comment'
import taglist from '../../utils/taglist'

export default {
  name: 'ArticleComment',
  components:{
    Article,Comment
  },
  data() {
    return {
      highlighter:null,
      auto:'on',
      load:false,
      title:'小鸡吃米图',
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
      tagList:taglist
    } 
  },
  created() {
    // console.log(this.tagList);
  },
  watch:{
      'bzshowID':function(newVal,oldVal){
          if(oldVal!=0){
              this.$refs.articleRef.removeClass(oldVal);
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
  methods: {
    addBzlist(obj){
      this.bzlist.push(obj);
    },
    editBzShowID(id){
      this.bzshowID = id;
    },
    deleteBzID(id){
      this.$refs.articleRef.deleteBz(id);
    },
    chooseShow(id){
      this.bzshowID = id;
      setTimeout(()=>{
         this.$refs.articleRef.addClass(id);
      },20)
    }
  }, 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .ArticleComment{
    padding: 0px 100px;
  }
</style>
