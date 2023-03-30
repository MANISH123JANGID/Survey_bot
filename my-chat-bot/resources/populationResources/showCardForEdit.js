const {getStatusnDetails}= require('../../services/axios');

 const EditCardRenderer=async (emailId)=>{
    const familyData= await getStatusnDetails(emailId);

    if(familyData.family){
        const card= {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.3",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Update your survey",
                            "wrap": true,
                            "fontType": "Default",
                            "size": "Large",
                            "weight": "Default",
                            "color": "Default",
                            "separator": true
                        }
                    ]
                },
                {
                    "type": "Input.Text",
                    "placeholder": "Enter your name",
                    "id": "name",
                    "label": "Name",
                    "separator": true,
                    "value": familyData.family.name
                },
                {
                    "type": "Input.Text",
                    "placeholder": "Enter email",
                    "id": "emailID",
                    "label": "Email",
                    "style": "Email",
                    "value": familyData.family.emailID
                },
                {
                    "type": "Input.ChoiceSet",
                    "choices": [
                        {
                            "title": "JOINT-FAMILY",
                            "value": "JOINT-FAMILY"
                        },
                        {
                            "title": "NUCLEAR-FAMILY",
                            "value": "NUCLEAR-FAMILY"
                        }
                    ],
                    "placeholder": familyData.family.familyType,
                    "id": "familyType",
                    "label": "Family-Type"
                },
                {
                    "type": "Input.Number",
                    "placeholder": "Enter total members",
                    "id": "numOfMembers",
                    "label": "Total Members",
                    "value": familyData.family.numOfMembers
                },
                {
                    "type": "Input.Number",
                    "placeholder": "Number of members below 18",
                    "id": "belowAgeOf18",
                    "label": "Members (below age of 18)",
                    "min": 0,
                    "value": familyData.family.belowAgeOf18
                },
                {
                    "type": "Input.Number",
                    "placeholder": "Number of members above 18",
                    "id": "aboveAgeOf18",
                    "label": "Members (above age of 18)",
                    "min": 0,
                    "value": familyData.family.aboveAgeOf18
                },
                {
                    "type": "Input.Number",
                    "placeholder": "Number of employed members",
                    "id": "numOfEmployed",
                    "label": "Employed Members ",
                    "min": 0,
                    "value":  familyData.family.numOfEmployed
                },
                {
                    "type": "Input.Number",
                    "placeholder": "Number of males",
                    "id": "numOfMales",
                    "label": "Number of Male",
                    "min": 0,
                    "value":familyData.family.numOfMales
                },
                {
                    "type": "Input.Number",
                    "placeholder": "Number of females",
                    "id": "numOfFemales",
                    "label": "Number of Female",
                    "min": 0,
                    "value": familyData.family.numOfFemales
                },
                {
                    "type": "Input.Text",
                    "placeholder": "Enter caste",
                    "id": "caste",
                    "label": "Caste",
                    "value":  familyData.family.caste
                },
                {
                    "type": "Input.ChoiceSet",
                    "choices": [
                        {
                            "title": "Hinduism",
                            "value": "Hinduism"
                        },
                        {
                            "title": "Islam",
                            "value": "Islam"
                        },
                        {
                            "title": "Sikhism",
                            "value": "Sikhism"
                        },
                        {
                            "title": "Christianity",
                            "value": "Christianity"
                        },
                        {
                            "title": "Jainism",
                            "value": "Jainism"
                        },
                        {
                            "title": "Buddhism",
                            "value": "Buddhism"
                        },
                        {
                            "title": "Tribal-Religion",
                            "value": "Tribal-Religion"
                        },
                        {
                            "title": "No religion",
                            "value": "No religion"
                        }
                    ],
                    "placeholder": familyData.family.religion,
                    "id": "religion",
                    "label": "Religion"
                },
                {
                    "type": "Input.ChoiceSet",
                    "choices": [
                        {
                            "title": "Upto ₹2.5 Lakh",
                            "value": "Upto ₹2.5 Lakh"
                        },
                        {
                            "title": "₹2.5-5 Lakh",
                            "value": "₹2.5-5 Lakh"
                        },
                        {
                            "title": "₹5-10 Lakh",
                            "value": "₹5-10 Lakh"
                        },
                        {
                            "title": "₹10-20 Lakh",
                            "value": "₹10-20 Lakh"
                        },
                        {
                            "title": "₹20-50 Lakh",
                            "value": "₹20-50 Lakh"
                        },
                        {
                            "title": "₹50-99 Lakh",
                            "value": "₹50-99 Lakh"
                        },
                        {
                            "title": "₹1 Crore or above",
                            "value": "₹1 Crore or above"
                        }
                    ],
                    "placeholder": familyData.family.familyIncome,
                    "id": "familyIncome",
                    "label": "Income Range",
                    "wrap": true
                },
                {
                    "type": "ActionSet",
                    "actions": [
                        {
                            "type": "Action.Submit",
                            "title": "Submit & Update",
                            "style": "positive"
                        }
                    ]
                }
            ]
        }
    
        console.log('this is the real card data',card);
    
        const data={};
        const userData={};
    
        userData.userId=familyData.family._id;
        
        data.card= card;
        data.userData= userData;
    
        return data;
    }else{
        return familyData;
    }
    
 }

 module.exports= {EditCardRenderer};


 
 
 