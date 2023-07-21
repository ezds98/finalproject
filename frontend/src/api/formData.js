

const genderOptions = [
    {
        label:"Male",
        value:"Male"
    },
    {
        label:"Female",
        value:"Female"
    },
    {
        label:"Unknown",
        value:"Unknown"
    },
    {
        label:"Indeterminate",
        value:"Indeterminate"
    },
    {
        label:"Free Text",
        value:"Free Text"
    },
]

const ethnicityOptions = [
    {
        label:'11 NZ European',
        value:'11 NZ European'
    },
    {
        label:'12 Other European',
        value:'12 Other European'
    },
    {
        label:'21 NZ Maori',
        value:'21 NZ Maori'
    },
    {
        label:'30 Pacific Island not further defined',
        value:'30 Pacific Island not further defined'
    },
    {
        label:'31 Samoan',
        value:'31 Samoan'
    },
    {
        label:'32 Cook Island Maori',
        value:'32 Cook Island Maori'
    },
    {
        label:'33 Tongan',
        value:'33 Tongan'
    },
    {
        label:'34 Niuean',
        value:'34 Niuean'
    },
    {
        label:'35 Tokelauan',
        value:'35 Tokelauan'
    },
    {
        label:'36 Fijian',
        value:'36 Fijian'
    },
    {
        label:'37 Other Paciific Island (not listed)',
        value:'37 Other Paciific Island (not listed)'
    },
    {
        label:'40 Asian',
        value:'40 Asian'
    },
    {
        label:'41 South east Asian',
        value:'41 South east Asian'
    },
    {
        label:'42 Chinese',
        value:'42 Chinese'
    },
    {
        label:'43 Indian',
        value:'43 Indian'
    },
    {
        label:'51 Middle Eastern',
        value:'51 Middle Eastern'
    },
    {
        label:'52 Latin American/Hispanic',
        value:'52 Latin American/Hispanic'
    },
    {
        label:'53 African',
        value:'53 African'
    },
    {
        label:'54 Nepalese',
        value:'54 Nepalese'
    },
    {
        label:'55 Russian',
        value:'55 Russian'
    },
    {
        label:"56 Korean",
        value:"56 Korean"
    },
    {
        label:'57 Italian',
        value:'57 Italian'
    },
    {
        label:'58 Canadian',
        value:'58 Canadian'
    },
    {
        label:'59 American',
        value:'59 American'
    },
    {
        label:'61 French',
        value:'61 French',
    },
    {
        label:'62 Romanian',
        value:'62 Romanian',
    },
    {
        label:'63 Slovic',
        value:'63 Slovic',
    },
    {
        label:'Free Text',
        value:'Free Text'
    },
]

const titleOptions = [
    {
        label:"Mr.",
        value:"Mr."
    },
    {
        label:"Mrs.",
        value:"Mrs."
    },
    {
        label:"Miss",
        value:"Miss"
    },
    {
        label:'Mast',
        value:'Mast'
    },
    {
        label:'Ms',
        value:'Ms'
    },
    {
        label:'Dr',
        value:"Dr."
    },
    {
        label:'Sir',
        value:'Sir'
    },
    {
        label:"Free Text",
        value:"Free Text"
    },
]

import {isRef,unref, isProxy} from "vue";

export default class FormData{
    category_form = [
        {
            step: 0,
            name: "Basic Details",
            isShown: true,
            qDetails: [
                {
                    topLabel:"Name",
                    comment:"Enter Category Name",
                    dat_name:["name"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },

                {
                    topLabel:"Description",
                    comment:"Enter Category Description",
                    dat_name:["description"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"Upload Category Image",
                    comment:"Upload Category Image",
                    dat_name:["image"],
                    details:"",
                    placeHolder:"",
                    type:"fileUpload",
                    fileType:'single'
                },
            ]
        }
    ]

    author_form = [
        {
            step: 0,
            name: "Basic Details",
            isShown: true,
            qDetails: [
                {
                    topLabel:"Name",
                    comment:"Enter Brand Name",
                    dat_name:["name"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"Location",
                    comment:"Enter Location",
                    dat_name:["location"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"Description",
                    comment:"Enter Category Description",
                    dat_name:["description"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"Upload Brand Image",
                    comment:"Upload Brand Image",
                    dat_name:["image"],
                    details:"",
                    placeHolder:"",
                    type:"fileUpload",
                    fileType:'single'
                },

            ]
        }
    ]

    sub_category_form = [
        {
            step: 0,
            name: "Basic Details",
            isShown: true,
            qDetails: [
                {
                    topLabel:"Name",
                    comment:"Enter Sub Category Name",
                    dat_name:["name"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"Category",
                    type:"querySearch",
                    query:"category_search",
                    dat_name:['category'],
                    hasDifferDetails:true,
                    replaceValue:'name',
                    details:""
                },
                {
                    topLabel:"Description",
                    comment:"Enter Category Description",
                    dat_name:["description"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"Upload Sub Category Image",
                    comment:"Upload Sub Category Image",
                    dat_name:["image"],
                    details:"",
                    placeHolder:"",
                    type:"fileUpload",
                    fileType:'single'
                },
            ]
        }
    ]

    product_form = [
        {
            step: 0,
            name: "Basic Details",
            isShown: true,
            qDetails: [
                {
                    topLabel:"Name",
                    comment:"Enter Product Name",
                    dat_name:["name"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
            
                {
                    topLabel:"Category",
                    type:"querySearch",
                    query:"category_search",
                    dat_name:['category'],
                    hasDifferDetails:true,
                    replaceValue:'name',
                    details:""
                },
                {
                    topLabel:"Sub Category",
                    type:"querySearch",
                    query:"sub_category_search",
                    dat_name:['sub_category'],
                    hasDifferDetails:true,
                    replaceValue:'name',
                    details:""
                },
                
                {
                    topLabel:"Enter Retail Price",
                    comment:"Enter Retail Price",
                    dat_name:["price"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"number"
                },
            ]
        },
        {
            step: 1,
            name: "Product Details",
            isShown: true,
            qDetails: [
                {
                    topLabel:"Show product as featured in homepage?",
                    comment:"Show product as featured in homepage?",
                    dat_name:["is_featured"],
                    details:false,
                    placeHolder:"",
                    type:"switch",
                },
                {
                    topLabel:"Enter Stock Count",
                    comment:"Enter Stock In Number",
                    dat_name:["stock"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"number"
                },
                {
                    topLabel:"Enter Description",
                    comment:"Enter Description",
                    dat_name:["description"],
                    details:"",
                    placeHolder:"",
                    type:"textBox",
                    inputType:"text"
                },
                {
                    topLabel: "Upload Product Images",
                    comment: "Upload Profile Picture",
                    dat_name: ["images"],
                    details: [],
                    placeHolder: "",
                    type: "fileUpload",
                    fileType: 'multiple'
                },
            ]
        }
    ]

    client_form = [
        {
            step:0,
            name:"Basic Details",
            isShown:true,
            qDetails:[
                {
                    topLabel:"First Name",
                    comment:"First Name",
                    dat_name:["first_name"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"Last Name",
                    comment:"Last Name",
                    dat_name:["last_name"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"Email",
                    comment:"Email",
                    dat_name:["email"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"email"
                },
                {
                    topLabel:"Address",
                    comment:"Address",
                    dat_name:["address"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"Apartment",
                    comment:"Apartment",
                    dat_name:["apartment"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"City",
                    comment:"City",
                    dat_name:["city"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"State",
                    comment:"State",
                    dat_name:["state"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"Phone",
                    comment:"phone",
                    dat_name:["phone"],
                    details:"",
                    placeHolder:"",
                    type:"text",
                    inputType:"text"
                },
                {
                    topLabel:"Upload Client Image",
                    comment:"Upload Client Image",
                    dat_name:["image"],
                    details:"",
                    placeHolder:"",
                    type:"fileUpload",
                    fileType:'single'
                },
            ]
        },
    ]

    findAndReturnDetails(details,value){
        for(let key in details){
            if(typeof details[key] === 'object'){
                for(let subKey in details[key]){
                    if(subKey === value){
                        if(typeof details[key][subKey] === 'string' && details[key][subKey] !== ''){
                            return details[key][subKey]
                        }
                    }
                }
            }
            else {
                if(key === value && typeof details[key] === 'string' && details[key] !== ''){
                    return details[key]
                }
            }
        }

        return null
    }

    createPostObject(form_data){
        let final = {}
        for(let i=0;i<form_data.length;i++){
            for(let j=0;j<form_data[i].qDetails.length;j++){
                if(form_data[i].qDetails[j].dat_name.length === 2){
                    let first = form_data[i].qDetails[j].dat_name[0]
                    let second = form_data[i].qDetails[j].dat_name[1]
                    if(!final[first]){
                        final[first] = {}
                    }
                    if(form_data[i].qDetails[j].details){
                        if(isProxy(form_data[i].qDetails[j].details)){
                            final[first][second] = JSON.parse(JSON.stringify(form_data[i].qDetails[j].details))
                        }
                        else {
                            final[first][second] = form_data[i].qDetails[j].details
                        }
                        //!final[first][second]?final[first][second] = form_data[i].qDetails[j].details:final[first][second] +=' ' + form_data[i].qDetails[j].details
                    }
                }
                else if(form_data[i].qDetails[j].dat_name.length === 1) {
                    if(form_data[i].qDetails[j].details){
                        if(isProxy(form_data[i].qDetails[j].details)){
                            final[form_data[i].qDetails[j].dat_name[0]] = JSON.parse(JSON.stringify(form_data[i].qDetails[j].details))
                        }
                        else {
                            final[form_data[i].qDetails[j].dat_name[0]] = form_data[i].qDetails[j].details
                        }
                        //!final[form_data[i].qDetails[j].dat_name[0]]?final[form_data[i].qDetails[j].dat_name[0]] = form_data[i].qDetails[j].details:final[form_data[i].qDetails[j].dat_name[0]] += ' ' +  form_data[i].qDetails[j].details
                    }
                }
            }
        }
        return final
    }

    createEditObject(form,details){
        let form_data = [...form]
        console.log(form)
        let ignoredVars = ['_id','deleted_at','created_at','updated_at','_v']
        for(let key in details){
            if(key === "product_options"){
                for(let y=0;y<form_data.length;y++){
                    let ind = form_data[y].qDetails.findIndex(m=>m.dat_name.includes(key))
                    if(ind>=0){
                        form_data[y].qDetails[ind].details = details[key]
                    }
                }
            }
            else if(key === "images"){
                for(let y=0;y<form_data.length;y++){
                    let ind = form_data[y].qDetails.findIndex(m=>m.dat_name.includes(key))
                    if(ind>=0){
                        form_data[y].qDetails[ind].details = details[key]
                    }
                }
            }
            else if(!ignoredVars.includes(key) && typeof details[key] === 'object'){
                for(let i=0;i<form_data.length;i++){
                    let ind = form_data[i].qDetails.findIndex(k=>k.dat_name.includes(key))
                    if(ind>=0){
                        for(let subKey in details[key]){
                            for(let j=0;j<form_data.length;j++){
                                let subInd = form_data[j].qDetails.findIndex(l=>l.dat_name.includes(subKey))
                                if(!ignoredVars.includes(subKey) && subInd>0){
                                    form_data[j].qDetails[subInd].details = details[key][subKey]
                                }
                            }
                        }
                    }
                }
            }
            else if(!ignoredVars.includes(key)){
                for(let y=0;y<form_data.length;y++){
                    let ind = form_data[y].qDetails.findIndex(m=>m.dat_name.includes(key))
                    if(ind>=0){
                        form_data[y].qDetails[ind].details = details[key]
                    }
                }
            }
        }
        // console.log(form_data)
        return form_data
    }
}
