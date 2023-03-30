  
 const {getStatusnDetailsOfEducation}= require('../../services/axios');

 const showEditCardforEdu=async (email)=>{
    console.log("emailId in renderer",email);
    const educationData= await getStatusnDetailsOfEducation(email);
    if(educationData.education){
    //     const date_time= educationData.education.createdAt;
    // const date= date_time.slice(0,10);
    // console.log("date",date);
    // const newDate= new Date(date);

    // const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // const month= months[newDate.getMonth()];
    // const year= newDate.getFullYear();
    // const finalDate= newDate.getDate();

    console.log('card render dunction',educationData)
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
                        "text": "Educational Survey",
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
                "placeholder": "Enter name here...",
                "id": "name",
                "label": "Name of Candidate",
                "value": educationData.education.name,
            },
            {
                "type": "Input.Text",
                "placeholder": "Enter email...",
                "id": "email",
                "label": "Email",
                "value": educationData.education.email
            },
            {
                "type": "Input.ChoiceSet",
                "choices": [
                    {
                        "title": "Primary Education",
                        "value": "Primary Education"
                    },
                    {
                        "title": "Secondary Education",
                        "value": "Secondary Education"
                    },
                    {
                        "title": "Diploma",
                        "value": "Diploma"
                    },
                    {
                        "title": "Bachelors",
                        "value": "Bachelors"
                    },
                    {
                        "title": "Masters",
                        "value": "Masters"
                    },
                    {
                        "title": "Doctorate",
                        "value": "Doctorate"
                    }
                ],
                "placeholder": "Select qualification",
                "label": "Highest Qualification",
                "id": "qualification",
                "isRequired": true,
                "errorMessage": "Qualification is required",
                "value": educationData.education.qualification
            },
            {
                "type": "Input.Text",
                "placeholder": "Enter name here",
                "id": "college",
                "label": "College/University/Institution",
                "separator": true,
                "isRequired": true,
                "errorMessage": "Institution name is required",
                "value": educationData.education.college
            },
            {
                "type": "Input.Text",
                "placeholder": "Enter grades here",
                "id": "grades",
                "label": "Grades/Percentage",
                "style": "Email",
                "isRequired": true,
                "errorMessage": "Grades are required",
                "value": educationData.education.grades
            },
            {
                "type": "Input.ChoiceSet",
                "choices": [
                    {
                        "title": "Placed via Campus Placements",
                        "value": "Placed via Campus Placements"
                    },
                    {
                        "title": "Placed via Off-Campus Placements",
                        "value": "Placed via Off-Campus Placements"
                    },
                    {
                        "title": "No placement assitance ",
                        "value": "No placement assitance "
                    }
                ],
                "placeholder": "Select status",
                "id": "placed",
                "label": "Placement Status",
                "isRequired": true,
                "errorMessage": "Placement status is required",
                "value": educationData.education.placed
            },
            {
                "type": "Input.ChoiceSet",
                "choices": [
                    {
                        "title": "Not Placed",
                        "value": "Not Placed"
                    },
                    {
                        "title": "₹1-3 LPA",
                        "value": "₹1-3 LPA"
                    },
                    {
                        "title": "₹3-6 LPA",
                        "value": "₹3-6 LPA"
                    },
                    {
                        "title": "₹6-10 LPA",
                        "value": "₹6-10 LPA"
                    },
                    {
                        "title": "₹10-15 LPA",
                        "value": "₹10-15 LPA"
                    },
                    {
                        "title": "₹15-20 LPA",
                        "value": "₹15-20 LPA"
                    },
                    {
                        "title": "₹20-30 LPA",
                        "value": "₹20-30 LPA"
                    },
                    {
                        "title": "₹30-50 LPA",
                        "value": "₹30-50 LPA"
                    },
                    {
                        "title": "₹50-70 LPA",
                        "value": "₹50-70 LPA"
                    },
                    {
                        "title": "₹70-99 LPA",
                        "value": "₹70-99 LPA"
                    },
                    {
                        "title": "₹99 LPA +",
                        "value": "₹99 LPA +"
                    }
                ],
                "placeholder": "Select Package Range",
                "id": "package_",
                "label": "Package Range",
                "isRequired": true,
                "errorMessage": "Required field",
                "value": educationData.education.package_
            },
            {
                "type": "Input.ChoiceSet",
                "choices": [
                    {
                        "title": "Below ₹3 Lakh",
                        "value": "Below ₹3 Lakh"
                    },
                    {
                        "title": "₹3-5 Lakh",
                        "value": "₹3-5 Lakh"
                    },
                    {
                        "title": "₹5-10 Lakh",
                        "value": "₹5-10 Lakh"
                    },
                    {
                        "title": "₹10-15 Lakh",
                        "value": "₹10-15 Lakh"
                    },
                    {
                        "title": "₹15-20 Lakh",
                        "value": "₹15-20 Lakh"
                    },
                    {
                        "title": "₹20-30 Lakh",
                        "value": "₹20-30 Lakh"
                    },
                    {
                        "title": "Above ₹30 Lakh",
                        "value": "Above ₹30 Lakh"
                    }
                ],
                "placeholder": "Select invested amount",
                "id": "invested",
                "label": "Amount Invested",
                "wrap": true,
                "isRequired": true,
                "errorMessage": "Field is required",
                "value": educationData.education.invested
            },
            {
                "type": "Input.ChoiceSet",
                "choices": [
                    {
                        "title": "1 Star",
                        "value": "1 Star"
                    },
                    {
                        "title": "2 Star",
                        "value": "2 Star"
                    },
                    {
                        "title": "3 Star",
                        "value": "3 Star"
                    },
                    {
                        "title": "4 Star",
                        "value": "4 Star"
                    },
                    {
                        "title": "5 Star",
                        "value": "5 Star"
                    }
                ],
                "placeholder": "Select Rating",
                "label": "Campus Rating",
                "isRequired": true,
                "errorMessage": "Campus rating is required",
                "id": "campus_rating",
                "value": educationData.education.campus_rating
            },
            {
                "type": "Input.Text",
                "placeholder": "Enter opinion here...",
                "label": "Write a few lines to describe your opinion",
                "id": "opinion",
                "value": educationData.education.opinion
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
    const data={};
    const userData={};

    userData.userId=educationData.education._id;
    
    data.card= card;
    data.userData= userData;

    return data;
    }else {
        return educationData;
    }
 }

 module.exports= {showEditCardforEdu};


 
 
 