import Task from "../models/task.model.js";
import list from "../models/list.model.js";
import mongoose from "mongoose";
import { populateLists } from "../utils/utilFunctions";

export const socketListController = (io,socket)=>{
    //@desc  create new list
    socket.on('add-list',async(data,callback)=>{
        const newList = {
            _id:mongoose.Types.ObjectId(),
            title:data.title,
            tasks:[],
        };

        io.to(data.projectId).emit('list-added',{
            list:newList,
        });

        callback();

        await list.updateOne(
            {projectId:data.projectId},
            {$push:{lists:newList}}
        );
    })

    //@desc change list index by dragging
    socket.on('list-move',async(data)=>{

        //destructure the data object to extract removedIndex, addedIndex, and projectId.
        const {removeIndex,addedIndex ,projectId} = data;

       //fetch the lists associated with the given projectID
        const newLists = await populateLists(projectId);

        //remove the list from its original position(removedIndex) in the array of lists
        //the split method returns an array with the removed elements,so destructure to get the first element(the removed list)
        const [list] = newLists.lists.splice(removedIndex,1);

        // Insert the list at its new position (addedIndex) in the array of lists.
        newLists.lists.splice(addedIndex,0,list);

         // Save the updated lists order to the database or any persistent storage.
        await newLists.save();

     // Emit an event 'lists-update' to all sockets in the specified projectId room,
     // sending the updated lists so all clients can synchronize their list order.
        socket.to(projectId).emit('lists-update',{newLists});
    })

    //@desc update list title
    socket.on('list-title-update',async(data,callback)=>{
        
        const {title,listIndex,projectId} = data;

        callback();

        socket.to(projectId).emit('list-title-updated',{title,listIndex});

        await List.updateOne(
            {projectId},
            {$set:{[`lists.${listIndex}.title`]:title}},
        )

    })

    //@desc delete list and archive all tasks inside
    // @desc Delete list and archive all tasks inside
    socket.on('list-delete', async (data) => {
    // Listen for the 'list-delete' event from the client.
    // The event is expected to provide data including projectId and listIndex.
  
    const { projectId, listIndex } = data;
    // Destructure the data object to extract projectId and listIndex.
  
    const lists = await List.findOne({ projectId });
    // Asynchronously find the list document associated with the given projectId.
  
    const [deletedList] = lists.lists.splice(listIndex, 1);
    // Remove the list at the specified listIndex from the lists array.
    // The splice method returns an array with the removed elements, so destructure to get the first element (the removed list).
  
    if (deletedList.tasks.length > 0) {
      // Check if the deleted list contains any tasks.
      await Task.updateMany(
        { _id: { $in: deletedList.tasks } },
        { $set: { archived: true } },
        { multi: true }
      );
      // Update all tasks in the deleted list, setting their 'archived' field to true.
      // The updateMany method updates multiple documents whose _id is in the deletedList.tasks array.
  
      lists.archivedTasks = [...lists.archivedTasks, ...deletedList.tasks];
      // Append the tasks from the deleted list to the archivedTasks array in the lists document.
    }
  
    await lists.save();
    // Save the updated lists document to the database.
  
    const newLists = await populateLists(projectId);
    // Asynchronously fetch the updated lists for the project.
  
    socket.to(projectId).emit('lists-update', { newLists });
    // Emit a 'lists-update' event to all sockets in the specified projectId room,
    // sending the updated lists so all clients can synchronize their view.
    });
  
}