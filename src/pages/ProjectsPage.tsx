import ProjectList from "../components/Project/ProjectList"


const ProjectsPage:React.FC = () => {
  return (
    <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Projects</h1>
        <ProjectList/>
    </div>
  )
}

export default ProjectsPage