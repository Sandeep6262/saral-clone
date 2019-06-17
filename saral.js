
const axios = require('axios')
const rl = require('readline-sync')

var page = axios.get('http://saral.navgurukul.org/api/courses')
page.then((response)=>{
  var courseIds = []
  var index = 1
  for(let course of response.data.availableCourses){
    courseIds.push(course.id)
    console.log(index +' '+ course.name)
    index+=1
  }
  return courseIds
})
.then((courseIds)=>{
  var user = rl.question("Enter course Number: ")
  course_id=  courseIds[parseInt(user)-1]
  return course_id
})
.then((course_id)=>{
  var url = 'http://saral.navgurukul.org/api/courses/'+ course_id+'/exercises'
  var course_page = axios.get(url)
  course_page.then((response)=>{
     return response.data.data
  })
  .then((course_details)=>{
    var counter = 1
    var slug_dict = {}
    for(let parentExe of course_details){
      console.log(counter + " " + parentExe.name)
      slug_dict[counter] = parentExe.slug
      if(parentExe.childExercises.length > 0){
        var sub_counter = 1
        for(let childExe of parentExe.childExercises){
          slug_dict[counter+"."+sub_counter] = childExe.slug
          console.log("    " +counter+"."+sub_counter + " "+childExe.name)
          sub_counter+=1
        }
      }
      counter +=1
    }
    return slug_dict
  })
  .then((slug_dict)=>{
    var user = rl.question("Enter excercise number: ")
    var url = "http://saral.navgurukul.org/api/courses/75/exercise/getBySlug?slug=" + slug_dict[user]
    var exePage = axios.get(url)
    exePage.then((response)=>{
      console.log(response.data.content)
    }).catch((err)=>{
      if(err){
        console.log("Excercise number is invalid.")
      }
    })
  }).catch((err)=>{
    if(err){
      console.log("Course number is invalid.")
    }
  })
})