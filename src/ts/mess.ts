class C
{
    count()
    {

    }
}

function f<T> ()
{
    let a:T;
    return (<C>a).count();
};




f<C>();