  
 const {getStatusnDetailsOfEducation}= require('../../services/axios');

 const educationSurveyRenderer=async (email)=>{
    console.log("emailId in renderer",email);
    const educationData= await getStatusnDetailsOfEducation(email);
    if(educationData.education){
        const date_time= educationData.education.createdAt;
    const date= date_time.slice(0,10);
    console.log("date",date);
    const newDate= new Date(date);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const month= months[newDate.getMonth()];
    const year= newDate.getFullYear();
    const finalDate= newDate.getDate();

    console.log('card render dunction',educationData)
    const card= {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "ColumnSet",
                        "columns": [
                            {
                                "type": "Column",
                                "width": "stretch",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "STATUS",
                                        "wrap": true,
                                        "fontType": "Default",
                                        "size": "Large",
                                        "weight": "Default",
                                        "color": "Default",
                                        "horizontalAlignment": "Left",
                                        "spacing": "None"
                                    }
                                ],
                                "verticalContentAlignment": "Center"
                            },
                            {
                                "type": "Column",
                                "width": "stretch",
                                "items": [
                                    {
                                        "type": "ColumnSet",
                                        "columns": [
                                            {
                                                "type": "Column",
                                                "width": "auto",
                                                "items": [
                                                    {
                                                        "type": "Image",
                                                        "url": "data:image/png;base64,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",
                                                        "size": "Small",
                                                        "horizontalAlignment": "Left",
                                                        "style": "Person",
                                                        "separator": true
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "Column",
                                                "width": "stretch",
                                                "items": [
                                                    {
                                                        "type": "TextBlock",
                                                        "text": `${educationData.education.Status}`,
                                                        "wrap": true,
                                                        "fontType": "Default",
                                                        "size": "Large",
                                                        "weight": "Bolder",
                                                        "horizontalAlignment": "Left",
                                                        "color": "Dark"
                                                    }
                                                ],
                                                "verticalContentAlignment": "Center"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "separator": true
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Email ID",
                                "wrap": true,
                                "fontType": "Default",
                                "size": "Large"
                            }
                        ],
                        "verticalContentAlignment": "Center"
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "auto",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2X5_2GLnG-08EQEhi5KI3Z1GpzjT32Kw9FaZn71g&s",
                                                "size": "Small"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": `${educationData.education.email}`,
                                                "wrap": true,
                                                "fontType": "Default",
                                                "size": "Medium",
                                                "color": "Dark",
                                                "weight": "Bolder"
                                            }
                                        ],
                                        "verticalContentAlignment": "Center"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "Container",
                "spacing": "Small",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "Education Profile",
                        "wrap": true,
                        "fontType": "Default",
                        "size": "Large",
                        "color": "Dark",
                        "weight": "Default",
                        "separator": true,
                        "spacing": "None"
                    }
                ],
                "separator": true
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Name of Candidate",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${educationData.education.name}`,
                                "wrap": true
                            }
                        ]
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Qualification",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${educationData.education.qualification}`,
                                "wrap": true
                            }
                        ]
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "College",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text":`${educationData.education.college}`,
                                "wrap": true
                            }
                        ]
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Grades/Percentage",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text":`${educationData.education.grades}`,
                                "wrap": true
                            }
                        ]
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Placement",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${educationData.education.placed}`,
                                "wrap": true
                            }
                        ]
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Package",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${educationData.education.package_}`,
                                "wrap": true
                            }
                        ]
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Invested Amount",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${educationData.education.invested}`,
                                "wrap": true
                            }
                        ]
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Campus Rating",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${educationData.education.campus_rating}`,
                                "wrap": true
                            }
                        ]
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Opinion",
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": `${educationData.education.opinion}`,
                                "wrap": true
                            }
                        ]
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "ColumnSet",
                        "columns": [
                            {
                                "type": "Column",
                                "width": "stretch",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Survey Filled On",
                                        "wrap": true,
                                        "fontType": "Default",
                                        "size": "Large",
                                        "weight": "Default",
                                        "color": "Dark"
                                    }
                                ],
                                "verticalContentAlignment": "Center"
                            },
                            {
                                "type": "Column",
                                "width": "stretch",
                                "items": [
                                    {
                                        "type": "ColumnSet",
                                        "columns": [
                                            {
                                                "type": "Column",
                                                "width": "auto",
                                                "items": [
                                                    {
                                                        "type": "Image",
                                                        "url": "https://cdn-icons-png.flaticon.com/512/55/55238.png",
                                                        "size": "Small"
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "Column",
                                                "width": "stretch",
                                                "items": [
                                                    {
                                                        "type": "TextBlock",
                                                        "text": `${finalDate} ${month} ${year}`,
                                                        "wrap": true
                                                    },
                                                    {
                                                        "type": "TextBlock",
                                                        "text": "18:32:55 HRS",
                                                        "wrap": true,
                                                        "spacing": "None"
                                                    }
                                                ],
                                                "verticalContentAlignment": "Center"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "separator": true
                    }
                ]
            }
        ]
    }
    console.log('this is the real card data',card)

    return card;
    }else {
        return educationData;
    }
 }

 module.exports= {educationSurveyRenderer};


 
 
 