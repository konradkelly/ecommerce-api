//place controller functions here...

export const login = (req, res) => {
    res.status(200).json("hi from login");
}
export const register = (req, res) => {
    res.status(200).json("hi from register");
}
export const products = (req, res) => {
    res.status(200).json("hi from products from jonus");
}

export const landingPage = (req, res) => {
    res.render("default", {
        title: "MVC Starter App",
        subtitle: "Express + EJS + Static Assets"
    });
}