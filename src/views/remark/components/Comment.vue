<template>
    <div class="asidediv">
        <el-card :body-style="{ padding: '10px'}" style="margin-bottom:8px;" v-for="(v,n) in bzlistSort" :key="v.id">
            <div style="display:flex;min-height:60px" @click="chooseShow(n,v.id)">    
                <div style="flex:1;">
                    <div class="userHead">
                        <img src="https://assets.smcdn.cn/static/unmd5/default-avatar-moke.2.png">
                    </div>
                </div>
                <div  style="flex:4;">
                    <div class="comment_top">
                       <span style="color:#a2a2a2;margin-right:20px;">
                           时不与我
                       </span>
                       <span  @click="deleteBz(v.id)">
                           删除
                       </span>
                       <!-- <span  @click="editBz(n,v.id)">
                           修改
                       </span> -->
                    </div>
                    <div v-if="bzshowID==v.id">
                        <!-- <el-input type="textarea" v-model="v.info" v-focus placeholder="点击可快速定位"  @blur="bzEditN = -1" :ref="v.id" autocomplete></el-input> -->
                        <textarea class="comment_textarea" rows="2" v-model="v.info" v-focus placeholder="请输入描述"  @blur="commitAjax()"></textarea>
                    </div>
                    <div v-else>
                        <div class="defaultText" v-html="v.info!=''?v.info:'点击可快速定位'"></div>
                    </div>
                </div>
            </div>
            <div class="tagDiv" v-if="bzshowID==v.id">
                <p class="title">系统点评类型: <span class="switchIcon" @click="swtichFunc()">换一换</span></p>
                <div class="tagClass">
                    <el-tag v-for="v in tagList[tagArrNum]"  :effect="chooseTagID==v.id?'dark':false" :key="v.id" @click="chooseTagFunc(v)">{{v.tag}}</el-tag>
                </div>
            </div>
            
           <!-- <div @click="chooseShow(v.id)">
                <el-input type="textarea" v-model="v.info" placeholder="点击可快速定位" :disabled="bzEditN==n?false:true" @blur="bzEditN = -1" :ref="v.id"></el-input>
                <div style="margin-top:10px" v-if="bzshowID==v.id">
                    <el-button type="primary" @click="editBz(n,v.id)">编辑</el-button>
                    <el-button type="delete" @click="deleteBz(v.id)">删除</el-button>
                </div>
           </div> -->
        </el-card>
        <!-- <div class="wrap__1XihD3" >
            <div class="body__12WqsT">
                <div class="editor-wrap__XGgUXc">
                    <div class="wrap__r8CFPa">
                        <img class="user__CsAP7n" src="https://assets.smcdn.cn/static/unmd5/default-avatar-moke.2.png">
                    </div>
                    <div class="input-area__soGZs9">
                        <span class="placeholder__3pz0aS">按enter发送，shift+enter换行</span>
                        <div class="input__1z_Hka" contenteditable="true"></div>
                    </div>
                </div>
            </div>
        </div> -->
        <!-- <div class="asidediv" v-for="(v,n) in bzlistSort" :key="v.id" @click="chooseShow(v.id)">
            <el-input type="textarea" v-model="v.info" placeholder="点击可快速定位" :disabled="bzEditN==n?false:true" @blur="bzEditN = -1" :ref="v.id"></el-input>
            <div style="margin-top:10px" v-if="bzshowID==v.id">
                <el-button type="success" @click="editBz(n,v.id)">编辑</el-button>
                <el-button type="delete" @click="deleteBz(v.id)">删除</el-button>
            </div>
        </div> -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            bzEditN:-1,
            tagArrNum:0,
            chooseTagID:'',
        }
    },
    props:['bzlistSort','bzshowID','tagList'],
    directives: {
        focus: {
            // 指令的定义
            inserted: function (el) {
                console.log(el);
                el.focus();
            }
        }
    },
    methods: {
        deleteBz(id){
            this.$emit('deleteBz',id);
        },
        // editBz(n,id){
        //     this.bzEditN=n;
        //     setTimeout(()=>{
        //         this.$refs[id][0].focus();
        //     },10)
        // },
        chooseShow(n,id){
            // console.log(id); 
            this.bzEditN=n;            
            this.$emit('chooseShow',id);
        },
        swtichFunc(){
            switch (this.tagArrNum) {
                case 0:
                    this.tagArrNum = 1;
                    break;
                case 1:
                    this.tagArrNum = 2;
                    break;
                case 2:
                    this.tagArrNum = 3;
                    break;
                case 3:
                    this.tagArrNum = 0;
                    break;
            }
        },
        chooseTagFunc(v){
            this.chooseTagID=v.id;  
        },
        commitAjax(){
            this.bzEditN = -1;
        }
    },
}
</script>
<style lang="scss">
    .asidediv{
        /* padding: 15px; */
        /* border: 1px solid #111111; */
        /* border-radius: 10px; */
        max-height: 510px;
        overflow: scroll;
    }
    .userHead{
        text-align: center;
        height: 100%;
        align-content: center;
        justify-content: center;
        img{
            max-height: 40px;
            margin-top: 10px;
        }
    } 
    .comment_top{
        text-align: left;
        padding: 5px;
        span {
            font-size: 12px;
            cursor: pointer;
            color: #297acc;
        }
    }
    .switchIcon{
        font-size: 14px;
        cursor: pointer;
        color: #297acc;
        margin-left: 20px;
    }
    .comment_textarea{
        width: 100%;
        font-size: 14px;
        display: block;
        resize: none;
        padding: 5px 15px;
        line-height: 1.5;
        box-sizing: border-box;
        color: #606266;
        background-color: #FFF;
        background-image: none;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        transition: border-color .2s;
    }    
    .comment_textarea:focus, select:focus{
        border:1px solid #3879d9;
        outline:none; 
    }
    .tagDiv{
        margin-top: 10px;
        .title{
            text-align: left;
        }
        .tagClass{
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            span{
                margin: 5px;
                cursor: pointer;
            }
        }
    }
    .defaultText{
        text-align: left;
        color: #333;
        font-size: 12px;
    }
</style>