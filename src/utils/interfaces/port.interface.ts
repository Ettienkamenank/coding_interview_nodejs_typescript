interface StandardPort<T> {
    create(value: T): Promise<T>;

    findOneById(id: string): Promise<T>;

    findAll(): Promise<T[]>;
}

export default StandardPort;
