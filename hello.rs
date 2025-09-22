fn main() {
    let mut counter = 0;
    loop {
        println!("hello");
        counter += 1;
        if counter >= 10 {
            break;
        }
    }
}
