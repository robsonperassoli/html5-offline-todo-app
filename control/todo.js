function TodoController($scope){
    function newTodo(){
        return {description: '',done: false};
    }
    function refresh(){
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    }
    var dbProps = {
        server: 'TodoList',
        version:2,
        schema: {
            todos: {
                key: { keyPath: 'id' , autoIncrement: true },
                indexes: {
                    description: {}
                }

            }
        }
    };
    $scope.itens = [];
    $scope.todo = newTodo();
    
    var init = function(){
        db.open(dbProps).done(function(s) {
            s.todos.query().all().execute().done(function(results) {
                $scope.itens = results;
                refresh()
            });
        });
    };
    init();
    
    $scope.save = function(){
        db.open(dbProps).done(function(s) {
            if($scope.todo.id){
                s.todos.update($scope.todo).done(function(item) {
                    $scope.todo = newTodo();
                    refresh();
                });
            } else{
                s.todos.add($scope.todo).done(function(item) {
                    $scope.itens.push($scope.todo);
                    $scope.todo = newTodo();
                    refresh();
                });
            }
        });  
    };
    
    $scope.remove = function(todo){
        db.open(dbProps).done(function(s) {
            s.todos.remove(todo.id).done(function(item) {
                var index = $scope.itens.indexOf(todo);
                $scope.itens.splice(index, 1);
                refresh();
            });
        });  
    };
    
    $scope.edit = function(todo){
        $scope.todo = todo;
    };
    
    $scope.changeStatus = function(todo){
        todo.done = !todo.done;
        db.open(dbProps).done(function(s) {
            s.todos.update(todo).done(function(item) {
                refresh();
            });
        });
    };
}