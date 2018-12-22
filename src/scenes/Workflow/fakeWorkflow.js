let i = 1;

let Workflow = {
  name: "Workflow de test",
  activity: {
    id: getId(),
    type: "Sequence",
    isMain: true,
    childrenActivities: [
      {
        id: getId(),
        name: "Inicio",
        type: "Initial",
        status: "Closed"
      },
      {
        id: getId(),
        name: "Tarea de test",
        type: "Task",
        status: "Started"
      },
      {
        id: getId(),
        name: "Final",
        type: "Final"
      }
    ]
  }
};

function getId() {
  i++;
  return i;
}
export default Workflow;
