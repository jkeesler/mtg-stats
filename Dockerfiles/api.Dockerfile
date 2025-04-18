FROM registry.access.redhat.com/ubi9:9.5-1744101466

RUN dnf install -y wget && \
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh && \
    bash ~/miniconda.sh -b -p /opt/conda && \
	rm ~/miniconda.sh

ENV PATH=/opt/conda/bin:$PATH
ENV FLASK_APP=./api/base.py

RUN conda update conda -y && \
    mkdir -p /app/stats

WORKDIR /app/stats

COPY ../conda-setup.yaml ./

RUN conda env create -f conda-setup.yaml && \
    conda init && \
    source ${HOME}/.bashrc

COPY ../api ./api
COPY ../init_scripts/entrypoint.sh ./

EXPOSE 5000

RUN chmod +x ./entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]



