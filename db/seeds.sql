INSERT INTO department (dept_name)
VALUES ("Assassins"),
       ("The Continental"),
       ("The High Table"),
       ("The Soup Kitchen");

INSERT INTO roles (title, salary, dept_id)
VALUES ("Master Assassin", 1000000, 1),
       ("Assassin", 250000, 1),
       ("Hitman", 100000, 1),
        ("Owner", 2500000, 2),
        ("Concierge", 80000, 2),
        ("Porter", 60000, 2),
        ("High Seat", 25000000, 3),
        ("Table Seat", 10000000, 3),
        ("Enforcer", 2000000, 3),
        ("King", 15000000, 4),
        ("Informant", 90000, 4);

       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE   ("John", "Wick", 2, NULL),
        ("Ms", "Perkins", 2, NULL),
        ("The", "Elder", 7, NULL),
        ("Bowery", "King", 10, NULL),
        ("Tick", "Tock", 2, 4),
        ("The", "Adjudicator", 9, 3),
        ("Winston", "Scott", 4, NULL),
        ("Charon", "Claw", 5, 7),
        ("Zero", "Sushi", 1, 6),
        ("Anjelica", "Ruska", 8, 3),
        ("Gianna", "D'Antonio", 8, 3),
        ("Santino", "D'Antonio", 8, 3),
        ("Sofia", "Al-Azwar", 4, NULL),
        ("Julius", "Santini", 4, NULL),
        ("Cassian", "Brown", 1, 11),
        ("Timothy", "Elias", 3, NULL),
        ("Francis", "Gerard", 3, NULL);