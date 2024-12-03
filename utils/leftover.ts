/*
-- app/layout --
<Authenticator>
</Authenticator>
*/
/*
-- app/page --
const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }
  
  listTodos();

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }
  
    <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li 
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>{todo.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
            <button onClick={signOut}>Sign out</button>
*/

/* 
--- To Fix ---

*/
