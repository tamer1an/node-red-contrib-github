// extern crate rustc_serialize;
// use rustc_serialize::json::Json;
// use serialize::json;
// #[macro_use]
extern crate json;
use std::fs::File;
use std::io::Read;
// use std::env;
// use std::io::prelude::*;

// fn fmt(&self, f: &mut Formatter) -> Result

fn main() {
// #     let args: Vec<String> = env::args().collect();
// #
// #     let query = &args[1];
// #     let filename = &args[2];
      let filename = "mystarred.json";
// #
// #     println!("Searching for {}", query);
    // --snip--
    println!("In file {}", filename);

    let mut f = File::open(filename).expect("file not found");

    let mut contents = String::new();
    f.read_to_string(&mut contents)
        .expect("something went wrong reading the file");

//     println!("With text:\n{}", contents);

    let parsed = json::parse(&contents).unwrap();

    println!("With json:\n{}", parsed[0]);

//     println!("With text:\n{}", json::encode(&contents));
}

// fn main() {
//     let file = File::open("./mystarred") //.unwrap();
//     let json = Json::from_str(&data).unwrap();
//     println!("{}", json);
//     println!("{}", fmt(file));
// }


// DRAFTS:

//     let test = match f {
//         Ok(file) => file,
//         Err(error) => {
//             panic!("No file found.");
//         }
//     }
//     println!("Hello, world!");